---
layout: post
title: "Samochodowe światła ostrzegawcze"
date: 2016-05-03
tags: [projects]
---

![Board](/images/blinker/main_low.jpg)

 Układ świateł ostrzegawczych, które mają służyć, jako dodatkowa sygnalizacja postoju samochodu dostawczego. W założeniu miały być dwa pomarańczowe panele na przodzie samochodu i jedno na tylnych drzwiach. Jako, że miejsca na układ było bardzo dużo, a klient chciał mieć możliwość ewentualnej zmiany częstotliwości, czy kolejności świecenia diod, postanowiłem wykorzystać dwa układy scalone. NE555 i DC4017.

## Działanie
Na płytce PCB został zamontowany potencjometr, który służy do zmiany regulacji częstotliwości świecenia lamp. W przypadku potrzeby zmiany kolejności rozbłysków można wykorzystać różne wyjścia układu DC4017. Jako, że w samochodzie ujemny biegun akumulatora znajduje się na wszystkich metalowych elementach, wygodniejsze jest sterowanie dodatnim biegunem. Wykorzystanie tranzystorów mocy typu PNP umożliwia takie właśnie sterowanie poszczególnych paneli LED.
W przypadku uszkodzenia tranzystorów (np. podczas przepięcia, czy ewentualnego zwarcia), wystarczy tylko odłączyć wykonawczą (górną) część płytki, bez konieczności demontażu całego układu.
Działanie układu pokazują niżej prezentowane obrazki GIF.

![GIF](/images/blinker/car1.gif)
![GIF](/images/blinker/car2.gif)
