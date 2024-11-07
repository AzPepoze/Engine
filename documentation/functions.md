---
description: List of functions
icon: function
---

# Functions

## <mark style="color:green;">Normal function</mark>

### Load file

{% hint style="info" %}
Load file (Reference from "Scenes" folder)
{% endhint %}

```js
LOAD ./path/to/your/file
```

***

### \[ACC] Auto change character animation

{% hint style="info" %}
* ACC : Auto change character (When change speaker)
* ENABLE / DISABLE
{% endhint %}

```c
ACC ENABLE
```

```c
ACC DISABLE
```

***

### Set position

Set character position

{% hint style="info" %}
* POS : Position
* X / Y / XY : x axis, y axis, Both(x,y) (Min = -100, Max = 100)
* [Time](functions.md#time)
{% endhint %}

```c
SET POS Character_Name X 100 [0.5] // right
```

```c
SET POS Character_Name Y -100 [0.1] // top
```

```c
SET POS Character_Name XY 0 0 [1] // center
```

***

### Speaker

{% hint style="info" %}
* Character\_Name : Speaker
* Clothes\_Name : Clothes name / Skin name
* \[[Direction](functions.md#direction)] : In-frame animation from that direction
{% endhint %}

```c
Character_Name Clothes_Name [Direction]
```

```c
นัท swim_suit [L]
```

***

### Choice

{% hint style="info" %}
* START/END : Start or End
* CHOICE : Choice
{% endhint %}

BEGIN WITH

```c
START CHOICE
```

INSIDE CHOICE

{% hint style="info" %}
Each CHOICE : Text of that choice
{% endhint %}

```css
CHOICE
     //DO STUFF
CHOICE
     //DO STUFF
     //DO STUFF
     //DO STUFF
```

END WITH

```c
END CHOICE
```

***

## IN PROGRESS

JUMP \[+/- number]

JUMP -100

SET OPA นัท 50

## Data types

### Direction

```js
[L] : LEFT
[R] : RIGHT
[T] : TOP
[B] : BOTTOM
```



### Time

* Animation time in second

