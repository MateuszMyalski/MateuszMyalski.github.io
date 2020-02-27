# Samochodowe światła ostrzegawcze
![Board](_articles/assets/blinker/main_low.jpg) Układ świateł ostrzegawczych, które mają służyć, jako dodatkowa sygnalizacja postoju samochodu dostawczego. W założeniu miały być dwa pomarańczowe panele na przodzie samochodu i jedno na tylnych drzwiach. Jako, że miejsca na układ było bardzo dużo, a klient chciał mieć możliwość ewentualnej zmiany częstotliwości, czy kolejności świecenia diód, postanowiłem wykorzystać dwa ukłądy scalone. NE555 i DC4017.

## Działanie
Na płytce PCB został zamontowany potencjometr, który służy do zmiany regulacji częstotliwości świecenia lamp. W przypadku potrzeby zmiany kolejności rozbłysków można wykorzystać różne wyjścia układu DC4017. Jako, że w samochodzie ujemny biegun akumulatora znajduje się na wszystkich metalowych elementach, wygodniejsze jest sterowanie dodatnim biegunem. Wykorzystanie tranzystorów mocy typu PNP umożliwia takie właśnie sterowanie poszczególnych paneli LED.
W przypadku uszkodzenia tranzystorów (np. podczas przepięcia, czy ewentualnego zwarcia), wystarczy tylko odłączyć wykonawczą (górną) część płytki, bez konieczności demontażu całego układu.
Działanie układu pokazują niżej prezentowane obrazki GIF.
![GIF](_articles/assets/blinker/car1.gif)
![GIF](_articles/assets/blinker/car2.gif)
