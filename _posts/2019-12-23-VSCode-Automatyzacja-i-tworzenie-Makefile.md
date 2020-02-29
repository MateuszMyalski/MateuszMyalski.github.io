---
layout: post
title: "VSCode Automatyzacja i tworzenie Makefile"
date: 2019-12-23
---
# VSCode Minimalistyczna konfiguracja (MinGW & Makefile & GDB)

Automatyzacja kompilacji programów napisanych w języku C, lub dostęp do debuggera potrafi być nieocenione, gdy potrzebujemy przetestować krótki program na naszym komputerze. Niektóre opisy, w jaki sposób pisać proste Makefile potrafią przysporzyć bóle głowy, a integracja z VSCode zawsze była dla mnie zagadką. W tym wpisie, postaram się wyjaśnić jak w prosty sposób napisać Makefile i zautomatyzować kompilację i debuggowanie w VSCode.

Przyjmijmy, że nasz folder projektowy ma następującą strukturę:

- ProjectFolder
  - main.c
  - utilfunc.c
  - utilfunc.h
  - build

## 1. Tworzenie Makefile

W tym rozdziale skupimy się na nauce pisania prostego Makefile, czyli pseudo-skryptu, który przetłumaczy nasze pliki napisane w języku C, na pliki z rozszerzeniem .o, a następnie połączy wszystkie wynikowe pliki w całość - w gotowy .exe. Dodatkowo w MakeFile możemy podać komendy, które nasz system ma po sobie wykonać np. czyszczenie projektu.

Pliki MakeFile możemy wykonać korzystając z polecenia:
`mingw32-make (nazwa pliku Makefile) (Etykieta podprogramu)`

```
mingw32-make Makefile main
```

Wiemy już jak wykonać to co napiszemy, przejdźmy teraz do wyjaśnienia co po kolei należy zawrzeć w pliku `Makefile`

Plik Makefile powinien zaczynać się od nagłówka komentującego

`# -*- MakeFile -*-`
Warto zaznaczyć, że znaki białe są dosyć istotne w tego typu plików.

Następnie określmy parę zmiennych, które ułatwią nam uniwersalizację poleceń wydawanych kompilatorowi.

```makefile
# -*- MakeFile -*-
CC = gcc#Informacja o tym, jakiego kompilatora używamy
BUILDPATH = build#Ścieżka do folderu, gdzie będą generowane pliki .o
OUTFILENAME = main#Nazwa końcowego pliku .exe
FLAGS = -Wall#Flagi dla kompilatora
DEBUGFLAGS = -g -Wall#Flagi dla kompilatora w przypadku korzystania z debugera
```

Aby odwołać się potem do zmiennych wpisujemy: `$(nazwa_zmiennej)`.
*Zauważ, że komentarze rozpoczynane są znakiem # stawianej zaraz po zakończeniu zmiennej. W przypadku, gdy dodasz tam inne znaki np. tab również zostaną przepisane do miejsca odwołania do zmiennej.*

Zacznijmy pisać pierwszą zależność. Struktura podprogramów wygląda następująco:

```makefile
etykieta: zależności
	instrukcje do wykonania
```

Etykieta, jak sama nazwa wskazuje - nazywa dany blok skryptu. Zależności określają nam, jakie podprogramy muszą zostać wykonane wcześniej, nim przejdziemy do wykonywania instrukcji. Przybliżmy do przykładem.
Wykonujemy polecenie `mingw32-make Makefile AAA`, w pliku make mamy następujący kod:

```makefile
# -*- MakeFile -*-
AAA: BBB.o CCC.o
	instrukcja1
BBB.o: BBB.c
	instrukcja2
CCC.o: CCC.c
	instrukcja3
```

Wywołujemy początkowo etykietę AAA, podprogram ten ma dwie zależności BBB.o i CCC.o. Oznacza to, że nim wykonamy instrukcję 1, musimy najpierw wykonać dwa podane podprogramy. Wykona się więc podprogram BBB.o (czyli instrukcja 2) i CCC.o (czyli instrukcja 3). Dopiero po ukończeniu tych działań wykona się instrukcja numer 1. Zależności w podprogramach BBB.o i CCC.o, mówią o tym, że aby wykonać ich instrukcje, potrzebny jest plik o rozszerzeniu BBB.c i CCC.c.

Wróćmy do pisania naszego prawdziwego makefile. Potrzebujemy skompilować główny kod programu, zawarty w pliku `main.c`, program korzysta z zewnętrznie dostarczonej funkcji, opisanej w pliku `utilfunc.c`. Potrzebujemy, więc dokonać kompilacji tych dwóch plików. Robiąc to ręcznie napisalibyśmy kolejno:

```
gcc -g -Wall -c main.c -o build/main.o
gcc -g -Wall -c utilfunc.c -o build/utilfunc.o
gcc -g -Wall build/main.o build/utilfunc.o -o main
```

Zapiszmy to w formie skryptu makefile, którego wykonamy poleceniem:
`mingw32-make Makefile main`

Pamiętajmy, że zostanie zamienione : 

- CC  na "gcc"
- DEBUGFLAGS na "-g -Wall"
- BUILDPATH na "build"
- OUTFILENAME na "main"

```makefile
main: main.o utilfunc.o
	$(CC) $(DEBUGFLAGS) $(BUILDPATH)/main.o $(BUILDPATH)/utilfunc.o -o $(OUTFILENAME) 

main.o: main.c
	$(CC) $(DEBUGFLAGS) -c main.c -o $(BUILDPATH)/main.o

utilfunc.o: utilfunc.c
	$(CC) $(DEBUGFLAGS) -c utilfunc.c -o $(BUILDPATH)/utilfunc.o

```

Jak sam widzisz, całe składanie gotowego pliku wykonawczego, musi zostać poprzedzone wygenerowaniem plików .o z kodu main.c i kodu w utilfunc.c.

Dodajmy jeszcze możliwość czyszczenia plików wygenerowanych w folderze `build`

```makefile
clean:
	del -f $(BUILDPATH)\*.o
```

*Ścieżki plików w makefile podajemy korzystając z '/', a ścieżki dla poleceń w wierszu poleceń (Windows) '\\'*.
Cały gotowy `Makefile`powinien prezentować się następująco:

```makefile
# -*- MakeFile -*-
CC = gcc#Informacja o tym, jakiego kompilatora używamy
BUILDPATH = build#Ścieżka do folderu, gdzie będą generowane pliki .o
OUTFILENAME = main#Nazwa końcowego pliku .exe
FLAGS = -Wall#Flagi dla kompilatora
DEBUGFLAGS = -g -Wall#Flagi dla kompilatora w przypadku korzystania z debugera

main: main.o utilfunc.o
	$(CC) $(DEBUGFLAGS) $(BUILDPATH)/main.o $(BUILDPATH)/utilfunc.o -o $(OUTFILENAME) 

main.o: main.c
	$(CC) $(DEBUGFLAGS) -c main.c -o $(BUILDPATH)/main.o

utilfunc.o: utilfunc.c
	$(CC) $(DEBUGFLAGS) -c utilfunc.c -o $(BUILDPATH)/utilfunc.o

clean:
	del -f $(BUILDPATH)\*.o

```

Teraz wywołujemy polecenie:
`mingw32-make Makefile main`, a potem chcąc wyczyścić projekt `mingw32-make Makefile clean`

Pliki .c również mogą być w pod folderach, wystarczy podać ich ścieżkę jak w przypadku, generowania plików .o do folderu `build`.

W przypadku, gdy nie chcemy kompilować kodu do debugowania, korzystamy ze zmiennej `FLAGS`, zamiast z `DEBUGFLAGS`.

Tworząc odpowiednie wersje skryptów, możemy decydować, czy uruchamiamy program w trybie do debugowania, czy normalnie. To jednak jest sprawa na osobny wpis.

## 2. Konfiguracja VSCode

Mamy już działający makefile. Teraz czas, na połączenie odpowiednich akcji wymaganych do kompilacji i uruchomienia kodu w VSCode.

*Pamiętaj, że musisz posiadać zainstalowane rozszerzenie C/C++ dla VSCode. Powinien on zostać Ci zaproponowany do instalacji automatycznie, jeżeli go nie posiadasz. Uważam też, że masz poprawnie skonfigurowany minGW i dodane zmienne środowiskowe do systemu. Jeżeli nie, w Internecie znajdziesz mnóstwo poradników w jaki sposób tego dokonać poprawnie.*

Rozpocznijmy od otwarcia naszego folderu z projektem w VSCode. Następnie, klikamy na ikonę z robaczkiem i naciskamy na symbol zębatki tuż obok zielonej strzałki. To wygeneruje nam plik `launch.json`.

Wklejamy poniższą zawartość do pliku:

```JSON
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
      {
        "name": "Hello world",
        "type": "cppdbg",
        "request": "launch",
        "program": "${workspaceFolder}/${fileBasenameNoExtension}.exe",
        "args": [],
        "stopAtEntry": false,
        "cwd": "${workspaceFolder}",
        "environment": [],
        "externalConsole": true,
        "MIMode": "gdb",
        "miDebuggerPath": "gdb.exe",
        "setupCommands": [
          {
            "description": "Włącz formatowanie kodu dla gdb",
            "text": "-enable-pretty-printing",
            "ignoreFailures": true
          }
        ]
      }
    ]
  }
```

Co możemy zmienić:
- **name** - Nazwa naszej konfiguracji startowej
- **program** - Nazwa naszego pliku wykonalnego, który zostanie wygenerowany po kompilacji. Tutaj nazwa automatycznie jest wpisywana w zależności, od pliku, w którym klikniemy `F5`.
- **args** - Argumenty przekazywane do naszego pliku .exe
- **externalConsole** - Czy program ma uruchomić się wykorzystując zewnętrzną konsolę.
- **setupCommands** - Argumenty przekazywane do debuggera GDB.

Czas na automatyzację wykonania pliku Makefile.
W utworzonym folderze .vscode dodajemy plik `tasks.json` i wklejamy do niego zawartość:

```JSON
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "shell",
            "label": "Build",
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "command": "mingw32-make",
            "args": [
                "Makefile",
                "main"
            ]
        }
    ]
}
```

W elemencie **command** wpisujemy jakiego programu do przetworzenia pliku makefile będziemy wykorzystywać, a w elemencie **args** - argumenty, które przekażemy.
Cała reszta może pozostać bez zmian. Tym plikiem symulujemy ręczne wpisanie w konsolę polecenia `mingw32-make Makefile main`.

Aby rozpocząć kompilację naszego kodu korzystamy z kombinacji klawiszy `CTRL + SHIFT + B`.
Następnie, aby rozpocząć debugowanie `F5`.

Jeżeli chcemy, aby przed każdym uruchomieniem programu wykonywana była kompilacja, w pliku `launch.json` dodajemy linijkę:

```JSON
"preLaunchTask": "Build"
```

Gdzie, `Build`, jest nazwą, którą umieściliśmy w pliku `tasks.json` w polu `label`.

To wszystko co potrzebne nam jest do zautomatyzowania małych projektów. Absolutnie nie uważam, że robię to w sposób uberpoprawny, aczkolwiek, dla moich zastosowań jest to idealne rozwiązanie. Do kompilacji prostego programu, składającego się np. tylko z pliku main potrzebne nam jest parę linijek. Specjalnie w poradniku postanowiłem dodać kolejny plik, aby zademonstrować, w jaki sposób łączyć poszczególne pliki w całość tworząc makefile.