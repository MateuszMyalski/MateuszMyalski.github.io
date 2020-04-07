---
layout: post
title: "Yet Another Protocol"
date: 2019-10-18
categories: [projects]
---
# Yet Another Protocol - YAP

![](/images/YAP/console.JPG)
W przypadku, gdy przychodzi nawiązać komunikację z PC-tem i mikrokontrolerem nasuwa się wiele pytań w jaki sposób zrobić to na tyle uniwersalnie, aby jednocześnie zachować kontrolę transmisji, móc wysyłać dane o różnej długości i móc przygotować na to urządzenie. Tak powstała biblioteka, która w prosty sposób pozwala na wykonanie tych dwóch czynności.

Wielokrotnie spotkałem się z sytuacją, gdzie długość komend wysyłanych do zewnętrznego urządzenia była bardzo zróżnicowana. W jednych poleceniach używało się argumentów, w drugich nie, czasami wystarczyło parę liter. Korzystając z platformy STM zwykle korzystałem z wbudowanego DMA, który pozwalał na odczytywanie danych po jednym bajcie na tyle szybko, że nie przeszkadzało to podczas przesyłania kolejnych znaków. Postanowiłem jednak wykorzystać przerwania sprzętowe, które w zasadzie tylko odpytują urządzenie, czy może aktualnie przetworzyć napływające dane. Dla __moich__ wymagań takie rozwiązanie było idealne w wielu przypadkach. Postanowiłem, więc napisać prostą bibliotekę dla platformy STM jak i dla systemów Windows korzystając z WinApi, aby móc w bardzo prosty sposób nawiązać pełną i poprawną transmisję pomiędzy dwoma urządzeniami. Osoby, które pracowały już z WinApi, wiedzą, że obsługa jego nie należy do najprostszych i samo przygotowanie struktur wymaga sporo linii kodów. YAP pozwala na wykorzystanie abstrakcyjnej warstwy, która wszelkie konfiguracje robi za programistę. Wysłanie pakietu korzystając z YAP wymaga zaledwie __8 linii kodu__, a jego odebranie również niewiele więcej. 

Obudowany pakiet zawiera w zasadzie dwa główne pola, o które wysyłający musi się zatroszczyć, pole: ID pakietu i sama jego zawartość, która jest ograniczona maksymalnym buforem 250 bajtów. Wszelka alokacja miejsca na dane wykonywana jest dynamicznie, tak aby nie marnować cennego miejsca, którego na mikrokontrolerze lepiej przeznaczyć na instrukcje dla procesora. Dokładny opis znajduje się na podanym niżej repozytorium. 

[Repozytorium Git](https://github.com/MateuszMyalski/yetanotherprotocol)