---
title: 'Supermicro ARS-511GD-NB-LCC: суперчип NVIDIA GB300 в настольном корпусе'
description: 'Supermicro выпустила Super AI Station — первую настольную рабочую станцию на суперчипе NVIDIA GB300 Grace Blackwell Ultra с жидкостным охлаждением и производительностью 20 PFLOPS.'
pubDate: '2026-04-06'
tags: ['supermicro', 'nvidia', 'gpu-servers', 'workstation', 'grace-blackwell']
source: 'https://www.supermicro.com/en/products/system/gpu/tower%20or%205u/ars-511gd-nb-lcc'
---

Supermicro начала поставки ARS-511GD-NB-LCC — настольной рабочей станции из линейки Super AI Station. Система размещает серверный суперчип NVIDIA GB300 Grace Blackwell Ultra в tower-корпусе формата 5U с замкнутым жидкостным охлаждением.

## Характеристики

В основе платформы — суперчип GB300, объединяющий 72-ядерный ARM-процессор NVIDIA Grace и GPU Blackwell B300 через интерфейс NVLink-C2C. Когерентная память: 496 GB LPDDR5X на стороне CPU и 252 GB HBM3e на стороне GPU — суммарно до 748 GB с общим адресным пространством. Заявленная производительность — 20 PFLOPS в FP4.

Хранение — до 5 слотов M.2 NVMe PCIe 5.0. Сеть — два порта 400GbE на базе ConnectX-8 SuperNIC, 10GbE LAN и 1GbE BMC (Aspeed AST2600). Три слота PCIe 5.0 (x16 + 2×x8). Блок питания 1600 Вт с Titanium-эффективностью подключается к стандартной розетке 115–240 В. GPU поддерживает Multi-Instance GPU — до 7 изолированных инстансов.

## Интеграция и применение

Станция ориентирована на организации с потребностью в AI-инфраструктуре on-premise: файнтюнинг моделей до триллиона параметров, инференс, прототипирование. Целевые заказчики — исследовательские лаборатории, университеты, стартапы с требованиями к приватности данных.

Архитектура ARM (Grace) отличает систему от серверов на Xeon и EPYC. Для интеграции нужна проверка совместимости: официально поддерживается Ubuntu 24.04+ с NVIDIA AI Developer Tools. Организациям с x86-стеком потребуется адаптация пайплайнов сборки и деплоя.

Замкнутое жидкостное охлаждение и низкий уровень шума позволяют размещать станцию в офисе без выделенной серверной. Габариты: 454.7 × 218.4 × 701 мм, вес — около 40 кг. Система доступна для заказа с марта 2026 года.

**Источники:**

- [Страница продукта — Supermicro](https://www.supermicro.com/en/products/system/gpu/tower%20or%205u/ars-511gd-nb-lcc)
- [Анонс GA — Supermicro Blog](https://learn-more.supermicro.com/data-center-stories/supermicro-super-ai-station-nvidia-gb300-now-available)
- [Пресс-релиз CES 2026 — PR Newswire](https://www.prnewswire.com/news-releases/supermicro-brings-enterprise-class-ai-performance-to-the-client-edge-and-consumer-markets-302653007.html)
