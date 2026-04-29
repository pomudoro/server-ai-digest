---
title: "CoreWeave добавляет NVIDIA Vera Rubin NVL72 и запускает Mission Control"
description: "CoreWeave объявила о развёртывании Vera Rubin NVL72 во второй половине 2026 года, запустила HGX B300 и представила Mission Control с интеграцией NVIDIA RAS Engine."
pubDate: "2026-04-29"
tags:
  [
    "coreweave",
    "vera-rubin",
    "nvl72",
    "hgx-b300",
    "nvidia",
    "cloud-infrastructure",
  ]
source: "https://investors.coreweave.com/news/news-details/2026/CoreWeave-Extends-Its-Cloud-Platform-with-NVIDIA-Rubin-Platform/default.aspx"
heroImage: "../../assets/digest/2026-04-29/coreweave-vera-rubin-nvl72-mission-control.webp"
---

CoreWeave продолжает наращивать парк GPU и одновременно работает над тем, чтобы управлять этим парком было не хаосом, а системой. На GTC 2026 компания объявила сразу о нескольких вещах: развёртывании NVIDIA Vera Rubin NVL72, запуске HGX B300 в облаке и новом операционном стандарте Mission Control.

**Vera Rubin NVL72 и Vera CPU Rack**

Vera Rubin — следующее поколение после Blackwell. NVL72 — это 72 GPU в одном rack-масштабном модуле, связанных NVLink. Для облачного провайдера такого масштаба, как CoreWeave, добавление нового поколения GPU — это не просто «обновление железа». Это перестройка scheduler, сети, cooling infrastructure и billing model.

CoreWeave планирует развернуть Vera Rubin NVL72 и Vera CPU Rack во второй половине 2026 года. Параллельно уже запущен HGX B300 — это значит, что прямо сейчас клиенты получают доступ к Blackwell Ultra, пока Rubin готовится к production.

Для ML-команд, которые сейчас планируют тренировки или inference на следующие 12–18 месяцев, это важный сигнал: если задача не горит, имеет смысл закладываться на Rubin в расчётах по железу.

**Mission Control: что это такое**

Mission Control — это то, что CoreWeave называет единым операционным стандартом для управления fleet. Ключевая интеграция — NVIDIA RAS Engine (Reliability, Availability, Serviceability). Это не маркетинговое слово, а конкретная система диагностики, которая позволяет детектировать и изолировать проблемы на уровне отдельного GPU, rack или группы rack до того, как они превращаются в job failure.

Для операторов кластеров это означает: меньше ручного разбора логов, быстрее root cause analysis, выше uptime. Для конечных пользователей — меньше прерванных тренировок и предсказуемый SLA.

Интеграция fleet-level диагностики с billing и scheduling — это задача, которую крупные on-premise операторы обычно решают самостоятельно, с переменным успехом. CoreWeave берёт её на себя как часть сервиса.

**HGX B300 уже доступен**

Параллельно с анонсами на GTC 2026 CoreWeave запустила HGX B300 в production. Это означает, что клиенты уже могут заказывать инстансы на Blackwell Ultra — с 2.1 TB HBM3e и высокоскоростной InfiniBand-сетью.

Для команд, которые сейчас тренируют большие модели на H100 и сталкиваются с ограничениями по памяти или пропускной способности inter-node сети, это практически значимое обновление. HBM3e даёт принципиально другие возможности по размеру модели в памяти без tensor-parallel через узлы.

**Что это значит для рынка**

CoreWeave последовательно строит не просто «GPU-in-the-cloud», а полноценную платформу с операционной обёрткой. Mission Control — это попытка закрыть разрыв между raw GPU capacity и управляемым сервисом, который нужен enterprise-клиентам.

Для on-premise операторов это ориентир: если хочешь конкурировать с облаком в удобстве, нужно инвестировать не только в железо, но и в observability, fleet management и автоматизированную диагностику.
