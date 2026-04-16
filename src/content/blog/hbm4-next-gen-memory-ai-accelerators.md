---
title: 'HBM4: удвоение шины и 2+ TB/s на стек'
description: 'Обзор стандарта HBM4 — памяти следующего поколения с 2048-битным интерфейсом, пропускной способностью свыше 2 TB/s и ёмкостью до 48 GB на стек.'
pubDate: '2026-04-13'
tags: ['hbm', 'memory', 'sk-hynix', 'samsung', 'nvidia', 'amd']
source: 'https://www.tomshardware.com/tech-industry/semiconductors/hbm-roadmaps-for-micron-samsung-and-sk-hynix-to-hbm4-and-beyond'
---

Каждое новое поколение ускорителей упирается в одно и то же ограничение — скорость, с которой GPU может читать данные из памяти. HBM4 — следующий шаг в гонке за bandwidth, и главное изменение здесь архитектурное: ширина интерфейса удваивается с 1024 до 2048 бит на стек.

## Что меняется по сравнению с HBM3e

| Параметр | HBM3e | HBM4 |
|---|---|---|
| Ширина интерфейса | 1024 бит | 2048 бит |
| Скорость на пин | до 9.6 Gb/s | 8–11.7 Gb/s |
| Bandwidth на стек | ~1.2 TB/s | 2+ TB/s |
| Ёмкость (16-Hi) | до 36 GB | до 48 GB |
| Энергоэффективность | базовая | ~40% ниже потребление на бит |

Удвоение ширины шины — самое значимое архитектурное изменение в HBM за последние поколения. Раньше bandwidth наращивали в основном за счёт скорости на пин; теперь — за счёт параллелизма. Это позволяет получить 2+ TB/s при умеренных тактовых частотах и лучшей энергоэффективности.

## Производители и сроки

Рынок HBM фактически делят три компании: SK Hynix, Samsung и Micron.

**SK Hynix** показала 16-слойный (16-Hi) стек HBM4 ёмкостью 48 GB со скоростью 11.7 Gb/s на пин — это рекорд плотности при сохранении стандартной высоты корпуса 775 мкм. Массовое производство запланировано на вторую половину 2026.

**Samsung** начала поставки образцов HBM4 в феврале 2026 со скоростью до 11.7 Gb/s. Samsung делает ставку на собственную технологию упаковки и раннее сотрудничество с заказчиками GPU.

**Micron** пока отстаёт по публичным анонсам HBM4, но активно наращивает мощности HBM3e и готовит переход.

## Кто будет потреблять HBM4

Первые ускорители на HBM4 — NVIDIA Vera Rubin (ожидается во второй половине 2026, 288 GB HBM4 на GPU, до 13 TB/s bandwidth) и AMD Instinct MI430X. Для Rubin NVIDIA заявляет стоечное решение NVL144 с 3.6 ExaFLOPS FP4 — и HBM4 здесь критичен для того, чтобы вычислительные блоки не простаивали в ожидании данных.

Уже на горизонте — HBM4E: скорости до 16 Gb/s, bandwidth свыше 4 TB/s на стек, таймфрейм — 2027. Гонка bandwidth далека от завершения.

## Что это значит на практике

Больше bandwidth — больше batch size при инференсе, ниже latency на токен, возможность обслуживать крупные модели на меньшем количестве ускорителей. Переход с HBM3e на HBM4 даст прирост bandwidth порядка 70–100% при сопоставимой ёмкости стека. Для кластеров, где memory bandwidth является bottleneck (а это большинство LLM-нагрузок), это ощутимый скачок.

**Источники:**

- [HBM Roadmaps: Micron, Samsung, SK Hynix — Tom's Hardware](https://www.tomshardware.com/tech-industry/semiconductors/hbm-roadmaps-for-micron-samsung-and-sk-hynix-to-hbm4-and-beyond)
- [HBM3e vs HBM4 Comparison — Kynix](https://www.kynix.com/Blog/hbm3e-vs-hbm4-2026-specs-performance--supply-guide.html)
- [State of HBM4 at CES 2026 — EE Times](https://www.eetimes.com/the-state-of-hbm4-chronicled-at-ces-2026/)
- [HBM Evolution — Introl](https://introl.com/blog/hbm-evolution-hbm3-hbm3e-hbm4-memory-ai-gpu-2025)
