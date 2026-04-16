---
title: 'Intel Gaudi 3: 128 GB HBM2e и встроенная сеть RoCE'
description: 'Обзор Intel Gaudi 3 — ускорителя с 128 GB HBM2e и интегрированными 24 портами RoCE, ориентированного на инференс как бюджетная альтернатива NVIDIA H100.'
pubDate: '2026-04-13'
tags: ['intel', 'gaudi', 'habana', 'inference', 'hbm', 'roce']
source: 'https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators/gaudi3.html'
---

Intel Gaudi 3 — третье поколение ускорителей от подразделения Habana Labs (Intel купила его в 2019-м). Позиционирование прямолинейное: дать альтернативу NVIDIA для инференса по более низкой цене за токен. Главная фишка — встроенная сеть, которая убирает из сметы отдельные сетевые адаптеры.

## Характеристики

Gaudi 3 оснащен 128 GB HBM2e с пропускной способностью около 3.7 TB/s. Это не HBM3e — по bandwidth отставание от H100 (3.35 TB/s HBM3) минимальное, но по объему Gaudi 3 выигрывает: 128 GB против 80 GB у H100. По сравнению с H200 (141 GB HBM3e, ~4.8 TB/s) отставание уже заметнее.

Вычислительная часть: два кремниевых die, каждый с набором Matrix Math Engines (MME) и Tensor Processor Cores (TPC). Заявленная производительность — до 1835 TFLOPS в BF16.

Формат — OAM (OCP Accelerator Module) и PCIe. OAM-версия предназначена для базовых плат Universal Baseboard (UBB) от Supermicro и других OEM. PCIe-вариант позволяет установить Gaudi 3 в стандартные серверы.

## Встроенная сеть RoCE

Это ключевое отличие от конкурентов. В каждый Gaudi 3 интегрированы 24 порта 200GbE RDMA over Converged Ethernet (RoCE). Суммарная сетевая пропускная способность — 4.8 Tb/s на чип.

Что это дает на практике: для кластера из 8 Gaudi 3 не нужны отдельные сетевые карты ConnectX-7 (~$1500–2000 за штуку). Экономия на 8-GPU узле — порядка $12 000–16 000 только на NIC, плюс упрощение кабельной инфраструктуры и снижение энергопотребления.

Ограничение — это Ethernet, не InfiniBand. Latency у RoCE выше, чем у native InfiniBand RDMA. Для инференса и файнтюнинга это приемлемо, для обучения с tight all-reduce на тысячах GPU — нет.

## Экосистема: SynapseAI vs CUDA

Gaudi 3 работает со стеком Habana SynapseAI. Поддержка PyTorch через Habana PyTorch bridge — для большинства стандартных моделей (Llama 2/3, GPT-NeoX, Stable Diffusion) есть готовые рецепты. По зрелости экосистемы SynapseAI отстает и от CUDA, и от ROCm — это основной барьер для миграции.

Intel активно публикует бенчмарки: на инференсе Llama 2 70B Gaudi 3 показывает throughput, сопоставимый с H100, при заметно более низкой стоимости системы. Независимые тесты подтверждают цифры для стандартных сценариев, но разброс возрастает на нестандартных архитектурах.

## Для кого

Gaudi 3 интересен организациям, которые строят инференс-кластеры и хотят снизить стоимость: телеком, enterprise с предсказуемыми нагрузками, облачные провайдеры второго эшелона. Встроенная сеть реально экономит деньги. Но если у вас уже инвестировано в CUDA-стек и вы планируете обучение — порог перехода высокий.

**Источники:**

- [Gaudi 3 — Intel](https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators/gaudi3.html)
- [Gaudi 3 Whitepaper — Habana Labs](https://habana.ai/products/gaudi3/)
- [Бенчмарки Gaudi 3 — Intel Developer Zone](https://developer.habana.ai/resources/habana-models-performance/)
