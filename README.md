<p align="center" font-size="1">
<strong style="font-size: 40px;">FookFixed Engine</strong>
</p>

-    A web-based visual novel game engine built with Electron (Chromium)

# Function

### Load file

-    Load file (Reference from current file)

```
LOAD ./path/to/your/file
```

#

### Auto change character

-    ACC : Auto change character (When change speaker)
-    ENABLE / DISABLE

```
ACC ENABLE
```

```
ACC DISABLE
```

#

### Set position

-    Set character position

```
SET POS Character_Name X 100
```

```
SET POS Character_Name Y -100
```

```
SET POS Character_Name XY 100 -100
```

#

### From direction

-    [From direction] : [L], [R], [T], [B] (LEFT, RIGHT, TOP, BOTTOM)

#

### Speaker

-    Character_Name : Speaker
-    Clothes_Name : Clothes name / Skin name
-    Inframe animation

```
Character_Name Clothes_Name [From direction]
```

```
นัท swim_suit [L]
```

#

### Choice

-    START/END : Start or End
-    CHOICE : Choice

BEGIN WITH

```
START CHOICE
```

INSIDE CHOICE

-    Each CHOICE : Text of that choice

```
CHOICE
     //DO STUFF
CHOICE
     //DO STUFF
     //DO STUFF
     //DO STUFF
```

END WITH

```
END CHOICE
```

## IN PROGRESS

JUMP [+/- number]

JUMP -100

SET OPA นัท 50
