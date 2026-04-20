---
title: "Dell PowerEdge XE9812: 72 GPU Vera Rubin в стойке и 260 ТБ/с NVLink"
description: "Новый rack-scale флагман Dell на платформе NVIDIA Vera Rubin NVL72: 72 GPU в одной стойке, полностью жидкостное охлаждение, 10× ниже стоимость за токен инференса MoE-моделей."
pubDate: "2026-04-20"
heroImage: "../../assets/digest/2026-04-20/dell-poweredge-xe9812-vera-rubin-nvl72-rackscale.webp"
cover: "../../assets/digest/2026-04-20/dell-poweredge-xe9812-vera-rubin-nvl72-rackscale.webp"
tags:
  [
    "dell",
    "nvidia",
    "gpu-servers",
    "rack-scale",
    "liquid-cooling",
    "vera-rubin",
    "nvl72",
  ]
source: "https://www.dell.com/en-us/blog/deploy-ai-faster-with-integrated-compute-and-networking-from-dell-and-nvidia/"
---

На GTC 2026 Dell показал PowerEdge XE9812 — rack-scale систему, которая упаковывает всю платформу NVIDIA Vera Rubin NVL72 в стойку Dell Integrated Rack 9000. Это наследник XE9712 на Blackwell NVL72. Железо целится в два сценария: обучение моделей на триллионы параметров и крупномасштабный инференс Mixture of Experts.

## 72 GPU и 260 ТБ/с на NVLink

Ключевая цифра — пропускная способность NVLink внутри стойки до 260 ТБ/с между GPU. Фраза Варуна Чхабры из Dell про «в одной стойке больше bandwidth, чем во всём интернете» — не совсем шутка. NVLink пятого поколения в Rubin NVL72 собирает 72 GPU в единый домен когерентной памяти, и для крупных MoE-моделей это меняет расклад: эксперты перестают упираться в межузловую сеть.

Dell заявляет 10-кратное снижение стоимости за токен на инференсе по сравнению с предыдущим поколением Blackwell и 4-кратное сокращение числа GPU, нужных для запуска MoE-модели. Цифры вендорские — пересчёт на независимых бенчмарках мы увидим, когда система начнёт поставляться (вторая половина 2026).

## Fanless и hot-swap

XE9812 полностью безвентиляторный. Единственная опция охлаждения — direct liquid cooling всей стойки. Воздушные варианты не обсуждаются: при плотности 72 GPU на rack-scale воздуху нечего предложить. Quick-disconnect коннекторы позволяют делать hot-swap компонентов без остановки соседних узлов — важно для SLA крупных AI-кластеров.

## Экосистема вокруг XE9812

Dell сразу обозначил линейку под Dell AI Factory with NVIDIA:

- **PowerEdge XE9880L / XE9882L / XE9885L** — liquid-cooled серверы на HGX Rubin NVL8 для тех, кто не готов разворачивать 72-GPU стойку. Доступность — Q3 2026.
- **PowerEdge R770 / R7715 / R7725** — mainstream-стойка с RTX PRO 4500 Blackwell Server Edition для enterprise-воркстейшенов и RAG-инференса. Уже в продаже.
- **PowerEdge M9822 / R9822** — первые серверы Dell на NVIDIA Vera CPU. Сентябрь 2026.

Глобальная доступность XE9812 — 2H 2026. Цены не анонсированы; у Dell Integrated Rack 9000 ценник на уровне предыдущей XE9712 начинался от семизначных чисел, здесь ожидаем аналогично.

## Что это значит для рынка

Rack-scale системы уровня NVL72 становятся новым стандартом для frontier-AI. HPE свой Cray Supercomputing GX240 обещает только на 2027, у Supermicro аналогичной интегрированной стойки на Rubin пока нет. Dell зашёл в это окно первым среди tier-1 вендоров — и получит несколько кварталов, чтобы закрепиться в хайперскейлерах и sovereign-AI контрактах.

Следующий интересный вопрос — как отреагирует AMD Helios (MI450) и будет ли он в том же ценовом классе. Пока Dell занимает позицию «готов к поставке раньше».
