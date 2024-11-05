# FookFixed Engine

-    A web-based visual novel game engine built with Electron (Chromium)

# Function

### Load file

-    Load file (Reference from "Scenes" folder)

```js
LOAD ./path/to/your/file
```

#

### Auto change character

-    ACC : Auto change character (When change speaker)
-    ENABLE / DISABLE

```c
ACC ENABLE
```

```c
ACC DISABLE
```

#

### Set position

-    Set character position
-    POS : Position
-    X / Y / XY : x axis, y axis, Both(x,y) (Min = -100, Max = 100)
-    [Time](#time)

```c
SET POS Character_Name X 100 [0.5] // right
```

```c
SET POS Character_Name Y -100 [0.1] // top
```

```c
SET POS Character_Name XY 0 0 [1] // center
```

#

### Speaker

-    Character_Name : Speaker
-    Clothes_Name : Clothes name / Skin name
-    Inframe animation
-    [From direction](#from-direction)

```c
Character_Name Clothes_Name [From direction]
```

```c
นัท swim_suit [L]
```

#

### Choice

-    START/END : Start or End
-    CHOICE : Choice

BEGIN WITH

```c
START CHOICE
```

INSIDE CHOICE

-    Each CHOICE : Text of that choice

```python
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

## IN PROGRESS

JUMP [+/- number]

JUMP -100

SET OPA นัท 50

# Data types

### From direction

```js
[L] : LEFT
[R] : RIGHT
[T] : TOP
[B] : BOTTOM
```

#

### Time

-    Animation time in second

#
