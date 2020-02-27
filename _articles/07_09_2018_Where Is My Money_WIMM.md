# Where Is My Money - WIMM

![WIMM](_articles/assets/wimm/WIMM.png) Monitorowanie swojego budżetu czasami wymaga, podzielenie go na subkonta, będące jednak praktycznie wciąż całością jednego konta bankowego. Nie znajdując odpowiedniej aplikacji, która potrafiłaby tą rzecz postanowiłem, że jako jeden ze swoich pierwszych projektów podczas nauki języka Python stworzę aplikację umożliwiającą śledzenie domowego budżetu uwzględniając jednocześnie możliwość posiadania różnych kont bankowych i **subkont**.

Wykorzystałem standardową bibliotekę graficzną, którą oferuje Python w swoim zestawie - Tkinter. Same walory estetyczne nie są porażające, aczkolwiek wielkim atutem tej biblioteki jest sama prostota użycia. Aplikacja przechowuje swoje dane w lokalnej bazie SQLite, przed niepowołanym dostępem zabezpiecza ją prosty formularz logowania. 

Przeglądając menu aplikacji, możemy znaleźć formularze umożliwiające **dodawanie kont bankowych** (w różnych walutach), **edycji informacji o użytkowniku**, **aktywne pole filtrów**, które pozwala nam na wyszukiwanie konkretnych działań na naszych kontach. Każdy efekt wyszukiwania możemy **wyeksportować** do odpowiednio sformatowanego pliku txt. Po prawej stronie aplikacji zostały umieszczone **wykresy**, które informują nas o wydatkach w trzech głównych grupach fun/targets/existence. Po zdefiniowaniu własnych subkategorii mamy możliwość ustawienia **"śledzika"**, który na bieżąco będzie pokazywał wydatki/przychody z aktualnego miesiąca i poprzedniego.

Program wykrywa automatycznie bazy danych umieszczone w tym samym pliku co plik wykonywalny. Aplikacji nie trzeba instalować, działa zaraz po pobraniu. 

*Osobiście bazę danych jak i sam program umieszczam na dysku Google, a na pulpicie tworzę jedynie skrót do programu, to pozwala na bardzo łatwą synchronizację baz danych pomiędzy różnymi urządzeniami.*

*Aktualnie projekt nie rozwijany dalej.*