---
title: 'On-prem кластер для файнтюнинга: минимум железа на 70B модель'
description: 'Практический гайд по сборке минимального on-prem кластера для файнтюнинга моделей класса Llama 70B: GPU, сеть, хранилище, питание и охлаждение.'
pubDate: '2026-04-13'
tags: ['on-premise', 'fine-tuning', 'gpu-cluster', 'h100', 'infrastructure']
source: 'https://lyceum.technology/magazine/which-gpu-for-fine-tuning-70b-model/'
---

Файнтюнинг 70B-модели — не то же самое, что обучение с нуля. Не нужен кластер на сотни GPU. Но и на одной видеокарте полный fine-tune не запустить: веса модели в FP16 занимают ~140 GB, плюс градиенты и состояния оптимизатора. Разбираемся, что реально нужно для on-prem установки.

## GPU: сколько и каких

Два сценария. **Полный fine-tune** (все параметры) модели класса Llama 3 70B требует минимум 8x H100 80 GB с FSDP или DeepSpeed ZeRO-3. На практике — один-два узла DGX или HGX. С H200 (141 GB HBM3e) задача проще: больше headroom под batch size и длинный контекст.

**QLoRA** (4-bit квантизация базовой модели + адаптеры в FP16) меняет расклад радикально. Веса 70B в 4-bit — ~35 GB. На одном H100 80 GB остаётся 45 GB под активации и KV-cache — достаточно для коротких последовательностей. FSDP + QLoRA позволяет работать даже на 4x GPU с 24 GB VRAM при CPU offloading, хотя скорость будет заметно ниже. Для продакшн-качества файнтюнинга оптимальная конфигурация — 4–8x H100/H200 в одном узле.

## Сеть

Внутри узла — NVLink (900 GB/s на H100, NVLink 4.0). Этого достаточно для sharded training на 8 GPU. Если нужен второй узел — InfiniBand NDR (400 Gb/s) с ConnectX-7. На двух узлах можно обойтись прямым подключением без коммутатора, но при трёх и более — нужен InfiniBand-свитч. Ethernet (RoCE) — бюджетная альтернатива, но latency выше, и для tight-coupled training это ощутимо.

## Хранилище

Датасеты для файнтюнинга обычно компактны (десятки-сотни GB), но чекпоинты 70B-модели — 140+ GB каждый, и сохраняются они регулярно. Минимум — NVMe-массив на каждом узле (4–8 TB). При нескольких узлах — параллельная файловая система: Lustre хорошо работает с InfiniBand, GPFS (IBM Spectrum Scale) универсальнее по сети. BeeGFS проще в развёртывании, но хуже справляется с мелкими файлами, типичными для ML-пайплайнов.

## Питание и охлаждение

Один узел с 8x H100 потребляет 10–12 кВт (каждый GPU — 700 Вт TDP, плюс CPU, память, диски). Два узла — 20–25 кВт с учётом сетевого оборудования. Нужны PDU на 240V и UPS соответствующей мощности.

При одном узле воздушное охлаждение ещё возможно, хотя шумно и на пределе. При двух и более — минимум rear door heat exchanger на стойку. Идеально — direct-to-chip liquid cooling, особенно если планируется расширение.

## Итого: минимальная конфигурация

| Компонент | Минимум (QLoRA) | Рекомендуется (full fine-tune) |
|---|---|---|
| GPU | 4x H100 80 GB | 8x H100/H200, 1–2 узла |
| Сеть (внутри узла) | NVLink | NVLink |
| Сеть (между узлами) | — | InfiniBand NDR |
| Хранилище | 4 TB NVMe | 8+ TB NVMe + параллельная ФС |
| Питание | ~6 кВт | 10–25 кВт |
| Охлаждение | Воздух | Rear door / DTC |

**Источники:**

- [Best GPU for Fine-Tuning 70B Models — Lyceum Technology](https://lyceum.technology/magazine/which-gpu-for-fine-tuning-70b-model/)
- [Fine-Tuning Infrastructure: LoRA, QLoRA, and PEFT at Scale — Introl](https://introl.com/blog/fine-tuning-infrastructure-lora-qlora-peft-scale-guide-2025)
- [FSDP + QLoRA: Train a 70B Model at Home — Answer.AI](https://www.answer.ai/posts/2024-03-06-fsdp-qlora.html)
- [GPU Options for Finetuning Large Models — DigitalOcean](https://www.digitalocean.com/resources/articles/gpu-options-finetuning)
