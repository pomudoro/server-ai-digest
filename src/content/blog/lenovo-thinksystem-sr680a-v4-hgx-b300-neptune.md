---
title: "Lenovo ThinkSystem SR680a V4: флагманский AI-сервер с HGX B300 и Neptune cooling"
description: "Lenovo выпустила SR680a V4 — 8U сервер под NVIDIA HGX B300 с 2.3 TB HBM3e, Intel Xeon 6, Neptune liquid cooling (PUE 1.1) и N+N power redundancy для on-premise LLM."
pubDate: "2026-04-29"
tags:
  [
    "lenovo",
    "thinksystem",
    "hgx-b300",
    "blackwell-ultra",
    "liquid-cooling",
    "on-premise",
    "llm",
  ]
source: "https://lenovopress.lenovo.com/servers/thinksystem-v4/sr680a-v4"
heroImage: "../../assets/digest/2026-04-29/lenovo-thinksystem-sr680a-v4-hgx-b300-neptune.webp"
---

Lenovo опубликовала product guide на ThinkSystem SR680a V4 — флагманский AI-сервер нового поколения под NVIDIA HGX B300. Это 8U платформа, которую Lenovo прямо позиционирует как основной on-premise вариант для обучения LLM и agentic inference. Посмотрим, что внутри и насколько это соответствует реальным требованиям.

**Железо и характеристики**

SR680a V4 несёт полный HGX B300 — 8 GPU NVIDIA Blackwell Ultra с суммарным объёмом HBM3e 2.3 TB. Это больше, чем у Supermicro HGX B300 (2.1 TB), хотя разница невелика и, скорее всего, объясняется конфигурацией конкретного GPU-модуля. Производительность Lenovo оценивает в 7x относительно Hopper — это корреспондируется с официальными данными NVIDIA по Blackwell Ultra.

Процессорная часть — Intel Xeon 6. Это важно для сценариев, где CPU активно участвует в препроцессинге данных или обслуживает inference pipeline: Xeon 6 существенно мощнее предыдущего поколения по производительности на поток и по memory bandwidth.

**Neptune liquid cooling**

Lenovo использует собственную систему жидкостного охлаждения Neptune. Заявленный PUE — 1.1, что соответствует лучшим показателям в индустрии. Для сравнения: воздушно-охлаждаемые системы в типичном дата-центре дают PUE 1.3–1.5. Разница в операционных затратах на электроэнергию при 24/7 нагрузке на протяжении нескольких лет становится ощутимой.

Neptune — это direct liquid cooling: теплоноситель подводится непосредственно к GPU и другим горячим компонентам. Это позволяет держать Blackwell Ultra на полном TDP без throttling, что критично для sustained training workloads.

**N+N power redundancy**

SR680a V4 поддерживает N+N power redundancy — то есть полное дублирование блоков питания. Для production AI-кластера это не опция, а baseline: потеря сервера в середине многосуточной тренировки из-за отказа PSU — это не только потеря времени, но и необходимость перестраивать checkpoint recovery.

**On-premise vs cloud**

Lenovo явно целится в сегмент, где компании хотят держать GPU локально — из соображений data sovereignty, стоимости или latency. При текущих ценах на облачные GPU-инстансы класса Blackwell Ultra on-premise при интенсивном использовании начинает окупаться быстрее, чем казалось ещё два года назад.

SR680a V4 покрывает оба ключевых сценария: обучение LLM (где нужен весь HBM3e 2.3 TB и максимальный throughput) и agentic inference (где важны latency и стабильность при mixed workload). 8U форм-фактор стандартен для большинства дата-центров — не требует специализированной rack-инфраструктуры под OCP ORV3, как некоторые конкурирующие решения.

**Что это значит на практике**

Для тех, кто сейчас выбирает платформу под on-premise AI: SR680a V4 — зрелое enterprise-решение с понятной поддержкой от Lenovo, хорошей документацией и отработанной интеграцией с NVIDIA-стеком. Neptune cooling с PUE 1.1 снижает операционные затраты, N+N redundancy даёт нужный uptime для production.

Основной вопрос — доступность и сроки поставки. HGX B300 — новая платформа, и supply chain исторически узкий в первые кварталы после анонса. Это стоит уточнять при планировании закупок.
