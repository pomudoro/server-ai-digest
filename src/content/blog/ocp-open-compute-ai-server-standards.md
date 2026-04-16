---
title: 'OCP и открытые стандарты: как меняется архитектура AI-серверов'
description: 'Обзор Open Compute Project и стандартов для AI-серверов: ORv3, 48V DC bus bar, вклад NVIDIA GB200 NVL72, и почему OCP — пока история гиперскейлеров.'
pubDate: '2026-04-13'
tags: ['ocp', 'open-compute', 'data-center', 'infrastructure', 'nvidia', 'standards']
source: 'https://developer.nvidia.com/blog/nvidia-contributes-nvidia-gb200-nvl72-designs-to-open-compute-project/'
---

Open Compute Project (OCP) — инициатива, запущенная Meta в 2011 году с целью стандартизировать серверное оборудование и убрать vendor lock-in. Пятнадцать лет спустя OCP — основа инфраструктуры гиперскейлеров, но для остального рынка картина сложнее.

## ORv3: стойка нового поколения

Open Rack v3 (ORv3, текущая ревизия — v3.1) — ключевая спецификация OCP для физической инфраструктуры. Главные отличия от стандартных 19-дюймовых EIA-стоек:

- **21-дюймовый формат** — больше пространства для воздушного потока и кабельной разводки
- **48V DC bus bar** — вертикальная медная шина питания вместо традиционных кабелей, blind-mate подключение блоков питания. Токи до 2500 A при 48V, а NVIDIA предложила усиленный дизайн на 1400 A на сегмент
- **Интеграция liquid cooling** — спецификация предусматривает in-rack манифолды для подвода хладоносителя к серверным cold plates с blind-mate коннекторами

48V DC — не каприз. При мощности стойки 100+ кВт (а GB200 NVL72 потребляет ~120 кВт) потери на 12V-конверсии становятся существенными. 48V снижает токи в 4 раза при той же мощности, упрощая шины и разъёмы.

## NVIDIA и OCP: GB200 NVL72 в открытом доступе

В октябре 2024 NVIDIA передала в OCP электромеханические дизайны GB200 NVL72: архитектуру стойки, механику compute- и switch-треев, спецификации жидкостного охлаждения и габариты NVLink cable cartridge. Всё это — производные от модульной архитектуры NVIDIA MGX.

Партнёры — AsRock Rack, ASUS, Dell, GIGABYTE, HPE, MSI, QCT, Supermicro, Wiwynn — строят собственные варианты серверов на базе этих дизайнов. Проект Stargate (Microsoft/OpenAI, $100 млрд на AI-инфраструктуру) стандартизирует развёртывание на 48V liquid-cooled ORv3 стойках с GB200 NVL72.

## Кто реально использует OCP

Рынок OCP-серверов растёт на ~22% в год (Mordor Intelligence), но потребители — преимущественно гиперскейлеры. «Большая семёрка» (Meta, Google, Amazon, Microsoft, Apple, Alibaba, ByteDance) имеет инженерные ресурсы для эксплуатации white-box оборудования. Тайваньские ODM — Foxconn, Wiwynn, Quanta, Inventec — производят 60% всех OCP-серверов.

Остальной рынок продолжает покупать Dell PowerEdge и HPE ProLiant. Причины прагматичны: 4-часовой on-site сервис, единое управление через iDRAC/iLO, проверенный софтверный стек. Dell и HPE выпускают OCP-совместимые линейки, но управляющий firmware остаётся проприетарным.

## Когда OCP имеет смысл

| Сценарий | OCP | Проприетарный |
|---|---|---|
| Кластер 100+ узлов | Экономия 15–30% на железе | Переплата за управляемость |
| 2–10 узлов | Overhead на интеграцию | Проще и быстрее |
| Нестандартная конфигурация | Гибкость дизайна | Ограничен каталогом |
| Нет DC-инженеров в штате | Рискованно | Вендорская поддержка |

OCP — не замена Dell или HPE для среднего бизнеса. Это инструмент для тех, кто строит инфраструктуру на масштабе, где стоимость vendor lock-in перевешивает стоимость собственной инженерии.

**Источники:**

- [NVIDIA Contributes GB200 NVL72 Designs to OCP — NVIDIA Developer Blog](https://developer.nvidia.com/blog/nvidia-contributes-nvidia-gb200-nvl72-designs-to-open-compute-project/)
- [OCP: Open Standards for Scalable AI Infrastructure — Data Center Frontier](https://www.datacenterfrontier.com/design/article/55288875/ocp-solidifies-role-as-catalyst-for-next-gen-ai-data-centers-and-infrastructure)
- [Dell at OCP Summit 2025 — Dell](https://www.dell.com/en-us/blog/dell-at-ocp-summit-2025-leading-open-scalable-ai-infrastructure/)
- [OCP Servers Market — Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/ocp-servers-market)
