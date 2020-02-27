# Feed the birds - symulacja z biblioteką p5 JavaScript

## Wstęp
![](_articles/assets/feedthebirds/p5.png)Pogłębiając wiedzę z języka JavaScript wpadła mi w ręce bardzo ciekawa biblioteka. Chcąc zaczerpnąc odrobinę odpoczynku od elektroniki, skusiłem się zajrzeć do zawartości biblioteki pod nazwą **p5**. Możliwości jakie p5 daje można wymieniać w nieskończoność. Przykłady, wykorzystania tej biblioteki można znaleźć na stronie, jak i w bardzo ciekawy sposób zaprezentowane na kanale youtube Coding Train. Ja postanowiłem stworzyć symulator karmienia ptaków.

## Założenia
Generować losowe obiekty, które są ptakami, a ptaki mają być łase na karmę, którą użytkownik rzuca na planszę. Ptak leci do najbliżeszgo ziarenka, zjada je i następnie (gdy nie ma już pokarmu na ekranie) odlatuje. Ptaszek im więcej zje tym większy się staje.

## Kod
Stykamy się tutaj z programowaniem obiektowym, postaram się więc rozbić kod na części i kolejno objaśniać w jaki sposób działa. Całość kodu można znaleźć w załączniku. Pragnę jednak zaznaczyć, że programowi daleko do perfekcji i pewne optymalizacje można poczynić. Moim celem nie była jak najlepsza optymalizacja, ale poznanie biblioteki i trening programowania obiektowego, z którym nie mam styczności na codzień.

## class bird
Klasa pojedynczego ptaka, która składa się z:
- Konstruktora - constructor(x, y, angle, color, FlyState, size);
- metody animacji - animateBird();
- metody poruszania - moveTo(x, y;
- metody rysowania - updateBird();
- metody jedzenia - eat(x, y, i);

**Konstruktor** - pierwsze dwa argumenty (x,y) pozwalają na umiejscowienie ptaszka na planszy. W celu zróżnicowania każdego obiektu dodane zostały pozostałe parametry. _Angle_ - to kąt w którą ptak będzie skierowany, _color_ - to kolor ptaka, _FlyState_ - odpowiada za początkową rozpiętość skrzydeł, dzięki temu ptaki nie machają skrzydłami w tym samym czasie, _size_ - określa rozmiar ptaka.

```JavaScript
constructor(x, y, angle, color, FlyState, size) {
  this.birdPX = x;
  this.birdPY = y;
  this.points = 0;

  this.birdSize = size;
  this.birdAngle = angle;

  this.birdColor = color;

  this.birdFlyState = FlyState;
  this.birdFlyUp = false;
}
```

**animateBird** - metoda pozwala na animacje ptaka. Zmienna _birdFlyUp_ decyduje o tym, czy skrzydła powinny się unosić czy opadać. Co każdą klatkę zmienna _birdFlyState_ jest inkrementowana, lub dekrementowana. Po odpowiednim przeliczeniu jej wartości można określić jak duże skrzydła powinny zostać wyrysowane.

```JavaScript
animateBird() {
  if (this.birdFlyState >= 1 && !this.birdFlyUp) {
    this.birdFlyState -= 1;
    if (this.birdFlyState == 1)
      this.birdFlyUp = true;
  }
  if (this.birdFlyState <= round(this.birdSize) && this.birdFlyUp) {
    this.birdFlyState += 1;
    if (this.birdFlyState == round(this.birdSize))
      this.birdFlyUp = false;
  }

}
```

**updateBird()** - tutaj korzystając już czysto z biblioteki p5 rysujemy figury (dwa trójkąty), z których składają się ptaki. W tym momencie pod uwagę brana jest wartość zmiennej _birdFlyState_, aby skrzydła były odpowiedniej wielkości i sprawiały wrażenie wznoszenia się i opadania.

```JavaScript
updateBird() {
  this.animateBird();
  push();
  fill(this.birdColor);
  strokeWeight(1);
  translate(this.birdPX, this.birdPY);
  rotate(this.birdAngle);
  triangle(0, 0, this.birdSize, 0, this.birdSize, this.birdFlyState / 100 * this.birdSize);
  triangle(0, 0, this.birdSize, 0, this.birdSize, -this.birdFlyState / 100 * this.birdSize);
  pop();
}
```

**moveTo(x, y)** - ta metoda przysporzyła mi najwięcej problemów, ale to opiszę za chwilę. Obiekt najpierw określa odległość do punktu w którym ma się znaleźć, a następnie losowo o wartości od 0.1 px do 5 px zmienia swoje położenie w stronę porządanego punktu. Moim problemem stał się jednak ogon ptaka. Jako, że figury są rysowane w odniesieniu od czubka (dziobu), to zwierzątko leciało do karmy bokiem. Długo głowiłem się, w jaki sposób mogę określić położenie ogonu. Próbowałem dwoływałać się do trygonometrii, ale to tylko komplikowało całą algorytmikę. W bibliotece p5 znalazłem jednak osobną funkcję, która zajmuje się odwróceniem obiektu w prządaną stronę. Jest nią _atan2(x,y)_. Nie będę tutaj kopiował opisu z oficjalnej strony, aczkolwiek gorąco zachęcam do przeanalizowania jej zasady działania, bo jest ona stworzona do właśnie takiego działania jak tu zaprezentowano. Na koniec, jeżeli obiekt jeszcze nie dotarł do porządanego miejsca, automatycznie wywoływana jest metoda rysowania ptaka, aby zmiana pozycji była widoczna.

```JavaScript
moveTo(x, y) {
  let distance = int(dist(x, y, this.birdPX, this.birdPY));
  if (distance > 1) {
    // push();
    // strokeWeight(1);
    // line(x, y, this.birdPX, this.birdPY);
    // pop();
    if (x > this.birdPX)
      this.birdPX += random(0.1, 5);
    if (x <= this.birdPX)
      this.birdPX -= random(0.1, 5);
    if (y > this.birdPY)
      this.birdPY += random(0.1, 5);
    if (y <= this.birdPY)
      this.birdPY -= random(0.1, 5);

    let tailPX = floor(this.birdPX + cos(this.birdAngle) * this.birdSize);
    let tailPY = floor(this.birdPY + sin(this.birdAngle) * this.birdSize);
    let perfectAngle = atan2(tailPY - y, tailPX - x);
    if (this.birdAngle > perfectAngle)
      this.birdAngle -= 0.1;
    if (this.birdAngle < perfectAngle)
      this.birdAngle += 0.1;
  } else {
    return true;
  }
  this.updateBird();
}
```

**eat(x, y, i)** - gdy ptak dotrze na wyznaczone miejsce i pokarm znajduje się nadal w tym miejscu, zostaje on zjedzony. Zjedzony, czyli usunięty z tablicy.

## function cramb
Pokarm, który użytkownik ustawia na planszy jest sam w sobie obiektem, który pamięta swoją pozycję. Każdy okruszek jest elementem w tablicy, który można z łatwością z niej zdjąć.

**updateCramb** - to tylko metoda obiektu, która nie przyjmuje żadnych parametrów. Pozwala jedynie na ustawienie kropki w miejscu, w którym został wskazany kursorem.

```JavaScript
this.updateCramb = function() {
  push();
  strokeWeight(5);
  point(this.crambPX, this.crambPY);
  pop();
}
```

## function mouseClicked
Podstawowa funkcja p5. Wywoływana automatycznie po kliknięciu przycisku myszy.
Pozwala na pobranie pozycji X i Y, w którym znajduje się kursor i utworzenie obiektu pokarmu, czyli de facto dorzucenie kolejnego miejsca w którym on się znajduje do tablicy o nazwie _crambs_. Funkcja _constrain_ pozwala na ograniczenie obszaru tylko do płótna, na którym rozgrywa się symulacja.

```JavaScript
function mouseClicked() {
	mousePX = constrain(mouseX, 0, width);
	mousePY = constrain(mouseY, 0, height);
	crambs.push(new cramb(mousePX, mousePY));
}
```

## function generateHideSpots
Ptaki w zamyśle miały wylatywać poza ekran, gdy na planszy nie znajduje się już żaden okruszek. Funkcja ta pozwala na łatwą generację losowych miejsc dla każdego ptaka, które znajdują się daleko poza obszarem płótna. Tworzy to iluzje, że każdy ptak leci w różnym kierunku.

```JavaScript
function generateHideSpots() {
		randomSeed(millis());
	for (let i = 0; i < parrot.length; i++) {
		hideSpots[i] = ["X"];
		hideSpots[i] = ["Y"];
		hideSpots[i]["X"] = random(-1, 1) > 0 ? random(-width, -500) : random(width + 50, width + 500);
		hideSpots[i]["Y"] = random(-1, 1) < 0 ? random(-height, -500) : random(height + 50, height + 500);
	}
}
```

## function setup - inicjalizacja
Podstawowa funkcja p5.
Tu tworzone jest płótno, konkretna liczba ptaków, jak i pierwsze losowe miejsca, do których świeżo wygenerowane obiekty mają się "rozlecieć".

```JavaScript
function setup() {
	createCanvas(windowWidth, windowHeight);
	//Init
	for (let i = 0; i < parrotsAmmount; i++)
		parrot[i] = new bird(
			random(0, width), //x
			random(0, height), //y
			random(0, 2 * PI), //rotate
			random(150, 255), //color
			floor(random(2, 20)), //fly state
			random(20, 40) //size
		);
	generateHideSpots();
}
```

## function draw
Podstawowa funkcja p5. Ten blok kodu wykonuje się domyślnie w 30 FPS`ach. Wykonywane są tutaj operacje sprawdzające, który ptak ma najbliżej do konkretnego ziarenka pokarmu, generowane losowe miejsca, rysowanie ptaków i pokarmu.

```JavaScript
function draw() {
	background(220);
	showFPS();

	if (crambs.length != 0) {
		let recordTable = [];

		//Check for nearest crumb
		for (let i = 0; i < parrot.length; i++) {
			for(let n = 0; n < crambs.length; n++){
				recordTable[n] = floor(dist(parrot[i].birdPX,parrot[i].birdPY,crambs[n].crambPX, crambs[n].crambPY));
			}

		//Search for index of the nearest crumb
			for(let n = 0; n < crambs.length; n++){
				if(recordTable[n] == min(recordTable)){
					if (parrot[i].moveTo(crambs[n].crambPX, crambs[n].crambPY)) {
						parrot[i].eat(crambs[n].crambPX, crambs[n].crambPY, n);
						break;
					}
				}
			}
		}
		generateHideSpots();
	} else {
		for (let i = 0; i < parrot.length; i++) {
			parrot[i].moveTo(hideSpots[i]["X"], hideSpots[i]["Y"]);
		}
	}

	for (let i = 0; i < crambs.length; i++)
		crambs[i].updateCramb();

	for (let i = 0; i < parrot.length; i++)
		parrot[i].updateBird();
}
```

## Zakończenie
Zabawa z tą biblioteką dostarczyła mi naprawdę wiele radości.  W przyszłosci, gdy będę potrzebował integracji moich urządzeń z prezentowaniem informacji w przeglądarce internetowej, na pewno sięgnę po p5. "Żywą" demonstarację symulatora karmienia ptaków można znaleźć w sekcji "załączniki".

## Załączniki
- Kod: [Źródło programu - JavaScript][kod]
- Repozytorium [BitBucket][bitbucket]
- Demonstracja działania programu: [Symulator karmienia ptaków DEMO][demonstracja]

  [kod]: http://myalski.co.uk/attachments/feedthebirds/feedTheBirds.js "Źródło programu - JavaScript"
  [demonstracja]: http://myalski.co.uk/attachments/feedthebirds/demo "Symulator karmienia ptaków DEMO"
  [bitbucket]: https://bitbucket.org/MateuszWaldemarMyalski/feed-the-birds-p5/src/master/ "Repozytorium"