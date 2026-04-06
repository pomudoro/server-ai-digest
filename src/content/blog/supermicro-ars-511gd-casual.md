---
title: 'Supermicro ARS-511GD-NB-LCC: суперчип GB300 прямо под стол'
description: 'Supermicro начала поставки Super AI Station — настольной рабочей станции на суперчипе NVIDIA GB300 Grace Blackwell Ultra с 20 PFLOPS и жидкостным охлаждением.'
pubDate: '2026-04-06'
tags: ['supermicro', 'nvidia', 'gpu-servers', 'workstation', 'grace-blackwell']
source: 'https://www.supermicro.com/en/products/system/gpu/tower%20or%205u/ars-511gd-nb-lcc'
---

Supermicro начала поставки Super AI Station — настольной рабочей станции на суперчипе NVIDIA GB300 Grace Blackwell Ultra. Мы разобрались, что внутри и кому это нужно.

## Что под капотом

В основе — связка 72-ядерного ARM-процессора NVIDIA Grace и GPU Blackwell B300, соединенных через NVLink-C2C на скорости 900 ГБ/с. Суммарная когерентная память — 748 ГБ: 496 ГБ LPDDR5X на CPU и 252 ГБ HBM3e на GPU. Заявленная мощность — 20 PFLOPS в FP4. Для сравнения, у классических PCIe-станций с отдельными GPU связь идет через шину на ~64 ГБ/с — разница в 14 раз.

Сеть — два порта 400GbE на ConnectX-8 SuperNIC, есть 10GbE и BMC. Хранение — 5 слотов M.2 NVMe PCIe 5.0. Три PCIe 5.0 слота для расширения. Питание — один блок на 1600 Вт с Titanium-рейтингом от обычной розетки. GPU поддерживает MIG — до 7 изолированных инстансов.

## Кому пригодится и что учесть

Мы видим тут прямое попадание в лаборатории, университеты и стартапы, которым нужен fine-tuning моделей до триллиона параметров on-premise, без облака. Станция тихая, с замкнутым жидкостным охлаждением — можно ставить в офис, серверная не нужна. Весит 40 кг, формат tower/5U.

Главный нюанс интеграции — ARM-архитектура Grace. Если у вас x86-пайплайны на Xeon или EPYC, придется адаптировать сборку и деплой. Официально поддерживается Ubuntu 24.04+ с NVIDIA AI Developer Tools. От DGX Station GB300 отличается наличием дополнительных PCIe-слотов, пяти M.2 и 10GbE — больше гибкости для кастомных конфигураций.

Станция доступна для заказа с марта 2026 года.

**Источники:**

- [Страница продукта — Supermicro](https://www.supermicro.com/en/products/system/gpu/tower%20or%205u/ars-511gd-nb-lcc)
- [Анонс GA — Supermicro Blog](https://learn-more.supermicro.com/data-center-stories/supermicro-super-ai-station-nvidia-gb300-now-available)
- [Пресс-релиз CES 2026 — PR Newswire](https://www.prnewswire.com/news-releases/supermicro-brings-enterprise-class-ai-performance-to-the-client-edge-and-consumer-markets-302653007.html)
