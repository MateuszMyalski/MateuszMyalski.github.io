---
layout: post
title: "Eksperyment przetwornicy z udziałem AVR"
date: 2018-06-20
tags: [projects]
---
## Wstęp
![](/images/przetwornica/uklad.png)

Robiąc małą inwentaryzację częsci, które plątały mi się po szafce, w moje ręce wpadła mała cewka. Do mojej głowy natychmiast wpadł pomysł wykorzystania jej do zrobienia prostego eksperymentu, który może przybliżyć mi problemy jakie można napotkać podczas projektowania przetwornicy. Postanowiłem wykorzystać mikrokontroler AVR, a dokładnie _ATTiny45_, aby kluczować tranzystor i utrzymywać zadane napięcie. Jako, że jest to mój pierwszy projekt dotyczący "zasilania" korzystający z techniki impulsowej, chciałem zdobyć odrobinę pojęcia o tym, w jaki sposób taki układ może się zachowywać.

Postanowiłem zbudować konwerter napięcia z 5V na 12V. Przystępując do projektowania, było dla mnie oczywistym, że upraszczając układ do ośmiobitowego sterownika nie można mieć wygórowanych marzeń. Układy takie, najlepiej realizuje się korzystając z dedykowanych układów scalonych, które doskonale radzą sobie z takim zadaniem.
Układ ograniczyłem do minimum, jego schemat jest wręcz wyjęty wprost z podręczników do elektroniki. Jako tranzystor kluczujący wybór padł na **IRF540**, dioda to element z odzysku o symbolu - **BA 159**. **Indukcyjność cewki około 100mH** - jako że element pozbawiony jest wszelkich oznaczeń, a nie posiadam urządzenia do zmierzenia tej wartości - wartość została oszacowana poprzez liczbę zwoi i wymiary elementu. Postanowiłem zabezpieczyć wejście ADC uC poprzez prosty dzielnik rezystorowy, który w przypadku nadmiernego napięcia wejściowego nie pozwoli, aby na wejściu ADC pojawiło się napięcie większe niż 5V.

## Praktyczna strona projektu
Elementy w tym projekcie absolutnie nie są krytyczne. Dodatkowo podkreślam, że jest to układ **WYŁĄCZNIE** edukacyjny i w takiej formie nie powinien być wykorzystywany w praktycznych rozwiązaniach. Co najważniejsze, układowi brak jakiegokolwiek zabezpieczenia _nadprądowego_ i wartości _napięcia wyjściowego_.

## Kod programu
Kod programu został napisany w czystym C. Przykład ten może pokazywać proste wykorzystanie 10 bitowego ADC, który możemy znaleźć w uC ATTiny45. _ADCW_ - Gotowe makro, które daje mi kompilator AVR-GCC, a mianowicie uzyskanie wartości napięcia łącząc dwa rejestry 8 bitowe, w których zapisana jest wartosć po konwersji ADC.
```C
#include <avr/io.h>

#define ADC_dest 52  //Output Voltage

uint16_t ADC_read( uint8_t channel );

int main( void ) {

    //ADC set up
    ADMUX |= ( 1 << REFS1) | ( 1 << REFS2 ); //2.56V ADC reference
    ADMUX |= ( 1 << MUX1 ); //ADC1 on PB2 MUX
    ADCSRA |= ( 1 << ADPS1 ) | ( 1 << ADPS2 ); //ADC Prescaler clk/64
    ADCSRA |= ( 1 << ADEN ); //Enable ADC

    //PWM set up on pin PB1
    DDRB |= ( 1 << PB1 );
    TCCR0A |= ( 1 << COM0B1 ) | ( 1 << WGM01 ) | ( 1 << WGM00 );  //Fast PWM Mode on pin PB1
    TCCR0B |= ( 1 << WGM02 ) | ( 1 << CS01 ); //Prescaler clk/2
    OCR0A = 100; //Compare match register A (Frequency)
    OCR0B = 25;  //Compare match register B (Duty)

    uint16_t pomiar;
    while ( 1 ) {

        ADC_val = ADC_read( 1 );
        if ( ADC_val > ADC_dest && OCR0B > 1 )
            OCR0B--;

        if ( ADC_val < ADC_dest && OCR0B < OCR0A - 10 )
            OCR0B++;

    }
}

uint16_t ADC_read( uint8_t channel ) {
    ADMUX = ( ADMUX & 0xF8 ) | channel; //Chose correct input
    ADCSRA |= ( 1 << ADSC ); //Start conversion
    while ( ADCSRA & ( 1 << ADSC ) ); //Wait until stop conversion
    return ADCW;
}

```
W załączniku przedstawiam algorytm, który ilustruje działanie programu.


## Ogólna budowa
Dokładny schemat urządzenia, wykonany w programie KiCad znajduje się w załączniku. W budowie przetwornicy zastosowałem cewkę z rdzeniem ferrytowym, której indukcyjność to około 100 μH. Element ten nie jest przystosowany do pracy przy dużych prądach z powodu małej średnicy drutu użytego w uzwojeniu, przekłada się to na obciążalność wyjściową przetwornicy, która nie jest wysoka.

Wykorzystany został jeden kanał ADC mikrokontrolera, którego rozdzielczość wynosi 10 bitów (±2 bity). Wejście pomiarowe zabezpieczone dzielnikiem napięciowym, składającym się z 100kΩ  i 1kΩ, umożliwia to podanie maksymalnego napięcia na wejście kanału pomiarowego o wartości większej niż 50V. Za napięcie odniesienia używane jest wewnętrzne źródło mikrokontrolera, które według noty katalogowej wynosi 2,56V. Częstotliwość próbkowania napięcia ustawiona została na 250kHz. Częstotliwość kluczowania tranzystora MOSFET ustawione na około 20kHz z wypełnieniem od 1% do około 98%. Na procesor podawany jest sygnał z rezonatora kwarcowego o wartości 16Mhz. Użycie zewnętrznego zegara nie było konieczne, aczkolwiek w celu minimalnej poprawy stabilności próbkowania został on zastosowany w układzie.

## Pomiary
- Urządzenia użyte do wykonania pomiarów:
- Multimetr – UNI-T UT60A
- Multimetr – UNI-T M890G
- Oscyloskop – GW INSTEK GDS-1072A-U

![](/images/przetwornica/tabela.jpg)

Jak widać, obciążalność, jak i sama sprawność przetwornicy jest tragiczna. Nie można jednakże powiedzieć, że idea jest wadliwa, ponieważ uzyskaliśmy pożądane napięcie wyjściowe.

## Załączniki
- Schemat [PDF][a6d5ede6]
- Symulacja [Plik LTSpice][fca5c106]
- Kod programu C [Program][7968bcce]
- [Algorytm][99498e14]

  [a6d5ede6]: http://myalski.co.uk/attachments/avrprzetwornica/schemat.pdf "PDF"
  [fca5c106]: http://myalski.co.uk/attachments/avrprzetwornica/symulacja.asc "Plik LTSpice"
  [7968bcce]: http://myalski.co.uk/attachments/avrprzetwornica/kod.c "Program"
  [99498e14]: http://myalski.co.uk/attachments/avrprzetwornica/diagram.png "Algorytm"
