---
title: 'InfiniBand vs Ultra Ethernet: сеть для AI-кластера'
description: 'Сравнение InfiniBand NDR/XDR и Ultra Ethernet (UEC 1.0) для AI-кластеров: latency, стоимость, масштабируемость и выбор по сценарию.'
pubDate: '2026-04-13'
tags: ['infiniband', 'ethernet', 'networking', 'gpu-cluster', 'nvidia', 'roce']
source: 'https://ultraethernet.org/ultra-ethernet-consortium-uec-launches-specification-1-0-transforming-ethernet-for-ai-and-hpc-at-scale/'
---

При масштабировании AI-кластера за пределы одного узла сеть становится узким местом. Внутри узла GPU связаны через NVLink (1.8 TB/s на Blackwell), но между узлами — InfiniBand или Ethernet, и разница в latency напрямую влияет на скорость all-reduce при обучении. Разбираем текущее состояние обоих подходов.

## InfiniBand: текущий стандарт

NVIDIA доминирует в InfiniBand через экосистему Mellanox. Текущее поколение — NDR (400 Gb/s на порт), адаптеры ConnectX-7. Следующее — XDR (800 Gb/s), ConnectX-8 SuperNIC с latency менее 800 наносекунд. На горизонте — ConnectX-9 и BlueField-4 DPU с Grace CPU на борту.

Главные преимущества: нативный RDMA с latency ~1–2 мкс, аппаратное управление потоком (credit-based flow control), адаптивная маршрутизация. Всё это критично для tight-coupled all-reduce, где тысячи GPU синхронизируются каждые несколько миллисекунд.

Проблемы: vendor lock-in (NVIDIA — единственный поставщик InfiniBand), стоимость на 1.5–2.5x выше Ethernet при учёте коммутаторов, адаптеров и специалистов. На кластере из 512 GPU разница в цене — это бюджет на дополнительные 128 GPU.

## Ultra Ethernet: стандартизация для AI

Ultra Ethernet Consortium (UEC) — альянс AMD, Intel, Broadcom, Meta, Microsoft, Arista, Cisco и HPE. В июне 2025 выпущена спецификация UEC 1.0 — это не просто RoCE с новым названием, а переработанный стек Ethernet, заточенный под коллективные операции AI-кластеров.

Ключевые элементы UEC 1.0: современный RDMA поверх Ethernet/IP, новые транспортные протоколы с congestion control для паттернов all-reduce, end-to-end шифрование на уровне группы (job-level encryption), мультивендорная интероперабельность.

RoCEv2 (RDMA over Converged Ethernet) — предшественник, уже используемый в продакшене. Meta обучила крупнейшие модели на RoCE-фабрике и подтвердила, что при правильной настройке throughput сопоставим с InfiniBand.

## Что выбрать

| Сценарий | Рекомендация |
|---|---|
| Обучение frontier-моделей (1000+ GPU) | InfiniBand — проверен на масштабе |
| Обучение средних моделей (64–512 GPU) | Ethernet (RoCE/UEC) — экономия 30–50% |
| Инференс-кластер | Ethernet — latency менее критична |
| Файнтюнинг, RAG | Ethernet — достаточно |

Примечательный сдвиг: в 2023 году InfiniBand занимал ~80% AI backend-сетей. К середине 2025 около 70% новых развёртываний выбирают Ethernet. Гиперскейлеры (Meta, Microsoft) валидировали RoCE на масштабе, а UEC 1.0 закрывает оставшиеся пробелы в congestion control и телеметрии.

InfiniBand остаётся лучшим выбором для максимальной производительности без компромиссов. Ethernet — для тех, кому важнее стоимость, мультивендорность и масштаб экосистемы.

**Источники:**

- [UEC Specification 1.0 — Ultra Ethernet Consortium](https://ultraethernet.org/ultra-ethernet-consortium-uec-launches-specification-1-0-transforming-ethernet-for-ai-and-hpc-at-scale/)
- [InfiniBand vs Ethernet for AI Clusters — Arc Compute](https://www.arccompute.io/arc-blog/infiniband-vs-ethernet-choosing-the-right-network-fabric-for-ai-clusters)
- [InfiniBand vs Ethernet GPU Clusters 800G — Introl](https://introl.com/blog/infiniband-vs-ethernet-gpu-clusters-800g-architecture)
- [Ultra Ethernet vs InfiniBand — Stordis](https://stordis.com/ultra-ethernet-vs-infiniband-roce-and-tcp/)
