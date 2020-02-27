# Elektroniczna kukułka

![main](_articles/assets/maszyna_do_cwierkania/main.jpg)W wolnym czasie realizuję zadania zlecone przez znajomych. Ostatnio zostałem poproszony o stworzenie układu elektronicznej kukułki, która ma działać wraz ze stajenką Bożonarodzeniową. 

W mojej miejscowości posiadamy bardzo dużą wystawną stajenkę, jako że układy działające tam mają już za sobą szmat czasu nastała pora na wymianę jednej z jej części. Niestety jej stara elektronika powoli pada i należało odtworzyć pewne układy. Zerknąwszy co posiadam aktualnie w swoim warsztacie udało mi się złożyć działający układ, który realizuje zadaną funkcję. Całość oparta na module **ISD1820** wraz z przedwzmacniaczem, wzmacniaczem i układem zasilającym. 
![main](_articles/assets/maszyna_do_cwierkania/inside.jpg)
Podchodząc do zadania starałem się znaleźć gotowe rozwiązanie, niestety nic oprócz dość sporych układów wykorzystujących generowanie dwóch częstotliwości nie znalazłem. Postanowiłem, więc wykorzystać nagranie śpiewu ptaka, który jest zapętlany w kółko. Wszystko zamknięte w jednej obudowie wraz ze wzmacniaczem 2x20W. Pomimo, że  dźwięk wychodzący z układu scalonego jest w wersji monofonicznej użycie dwóch głośników było konieczne w celu zapewnienia odpowiedniej głośności i efektu. 

## Szczegóły

Korzystając z tak prymitywnego rozwiązania trzeba liczyć się z dość niską jakością, jaką możemy uzyskać z tego układu. Podczas testów stwierdziłem, że należy choć odrobinę wzmocnić sygnał wychodzący z ISD1820 i postarać się usunąć niechciane częstotliwości z nagrania. Jako, że tematyką audio nie zajmuję się na co dzień, większość elementów zostało dobrana "na ucho". 

![main](_articles/assets/maszyna_do_cwierkania/ISD1820.jpg)Wzmacniacze operacyjne korzystają z układu wirtualnej masy, tz. Ich wejścia nieodwracające nie są bezpośrednio złączone z masą, ale dzielą napięcie __prawie__ w połowie 5V. Dlaczego asymetryczny podział napięcia? Oglądając przebieg na oscyloskopie zauważyłem, że wyjście głośnikowe powyższego układu scalonego nie jest dokładnie symetryczne. Dobrałem, więc elementy tak, aby ani dolna, ani górna część przebiegów nie była ścinana na wyjściu wzmacniaczy. Przedwzmacniacz zbudowany na bardzo tanim układzie LM358.

W obudowie urządzenia znajdziemy zasilacz, układ prostujący i stabilizujący napięcie, sam moduł ISD1820 z przedwzmacniaczem i wzmacniacz audio klasy D.