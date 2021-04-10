var gridSize = 75
var interval;

var correspondance = {
    "Alive" : 1,
    "Dead" : 0,
    "Wall" : 2,
    "Invincible" : 3
}

var tilesFinals = [
    {
        name : "dead",
        change : [
            {numberOfNeib : 3, nextState : 1},
        ]
    },
    {
        name : "alive",
        change : [
            {numberOfNeib : 0, nextState : 0},
            {numberOfNeib : 1, nextState : 0},
            {numberOfNeib : 4, nextState : 0},
            {numberOfNeib : 5, nextState : 0},
            {numberOfNeib : 6, nextState : 0},
            {numberOfNeib : 7, nextState : 0},
            {numberOfNeib : 8, nextState : 0},
        ]
    },
    {
        name : "wall",
        change : [
        ]
    },
    {
        name : "invincible",
        change : [
        ]
    }
]

$( document ).ready(function() {

    // pop table
    for (let i = 0; i<gridSize; i++) {
        var row = $(document.createElement('tr'))
        for (let j = 0; j<gridSize; j++) {
            row.append("<td></td>")
        } 
        $("#game").append(row)
    }

    $('td').mousedown(function(event) {
        var tile = $("#typeOfTile").val()
        if ($(this).hasClass(tile)) {
            $(this).toggleClass(tile) 
        } else {
            $(this).removeClass()
            $(this).addClass(tile)
        }
    });

    $("#go").click(function() {
        clearInterval(interval);
        interval = setInterval(playCycle, 100);
        $("#stop").addClass("ready")
        $(this).removeClass("ready")
    })

    $("#stop").click(function() {
        clearInterval(interval);
        $("#go").addClass("ready")
        $(this).removeClass("ready")
    })

    $("#clear").click(function() {
        clearInterval(interval);
        $("#go").addClass("ready")
        $("#stop").removeClass("ready")
        $("tr").each(function(rowNumber) {
            $(this).find("td").each(function(indexInRow) {
                $(this).removeClass()
            })
        })
    })
});

function playCycle() {
    tableStatus = [];
    getActualConfiguration()
    defineNextStep()
}

var tableStatus = [];
function getActualConfiguration() {
    $("tr").each(function(rowNumber) {
        var row = []
        $(this).find("td").each(function(indexInRow) {
            if ($(this).hasClass("alive")) {
                row.push("1")
            } else if ($(this).hasClass("wall")) {
                row.push("2")
            } else if ($(this).hasClass("invicible")) {
                row.push("3")
            } else {
                row.push("0")
            }
        })
        tableStatus.push(row)
    })
}

function defineNextStep() {
    var tableNextStep = [];
    tableStatus.forEach(function(row, indexY) {
        var rowState = []
        row.forEach(function(element, indexX) {
            var count = getNeighboorsCount(indexX,indexY)
            
            /*if (element == "1" && count != 2 && count != 3) {
                rowState.push("0")
            } else if (element == "0" && count == 3) {
                rowState.push("1")
            }  else if (element == "0" && count == 8) {
                rowState.push("3")
            }  else if (element == "3" && count == 8) {
                rowState.push("2")
            }  else {
                rowState.push(element)
            }*/

            var nextState = tilesFinals[element].change.find(element => element.numberOfNeib == count)
            if (undefined != nextState) {
                rowState.push(nextState.nextState)
            } else {
                rowState.push(element)
            }
        })
        tableNextStep.push(rowState)
    })
    applyToTable(tableNextStep)
}

function applyToTable(tableNextStep) {
    $("tr").each(function(rowNumber) {
        $(this).find("td").each(function(indexInRow) {
            $(this).removeClass()
            if ("1" == tableNextStep[rowNumber][indexInRow]) {
                $(this).addClass("alive")
            } else if ("2" == tableNextStep[rowNumber][indexInRow]) {
                $(this).addClass("wall")
            } else if ("3" == tableNextStep[rowNumber][indexInRow]) {
                $(this).addClass("invicible")
            }
        })
    })
}

function getNeighboorsCount(x,y) {
    var count = 0;
    var countedTile = ["1","3"]
    if (x != 0 && y != 0 && x != gridSize-1 && y != gridSize-1) {

        if (typeof tableStatus[y-1][x-1] !== 'undefined' && countedTile.includes(tableStatus[y-1][x-1])) count++;
        if (typeof tableStatus[y-1][x] !== 'undefined' && countedTile.includes(tableStatus[y-1][x])) count++;
        if (typeof tableStatus[y-1][x+1] !== 'undefined' && countedTile.includes(tableStatus[y-1][x+1])) count++;
        if (typeof tableStatus[y][x-1] !== 'undefined' && countedTile.includes(tableStatus[y][x-1])) count++;
        if (typeof tableStatus[y][x+1] !== 'undefined' && countedTile.includes(tableStatus[y][x+1])) count++;
        if (typeof tableStatus[y+1][x-1] !== 'undefined' && countedTile.includes(tableStatus[y+1][x-1])) count++;
        if (typeof tableStatus[y+1][x] !== 'undefined' && countedTile.includes(tableStatus[y+1][x])) count++;
        if (typeof tableStatus[y+1][x+1] !== 'undefined' && countedTile.includes(tableStatus[y+1][x+1])) count++;
    } else if (x == 0 && y == 0) {
        if (typeof tableStatus[y][x+1] !== 'undefined' && countedTile.includes(tableStatus[y][x+1])) count++;
        if (typeof tableStatus[y+1][x] !== 'undefined' && countedTile.includes(tableStatus[y+1][x])) count++;
        if (typeof tableStatus[y+1][x+1] !== 'undefined' && countedTile.includes(tableStatus[y+1][x+1])) count++;
    } else if (x == 0 && y == gridSize-1) {
        if (typeof tableStatus[y-1][x] !== 'undefined' && countedTile.includes(tableStatus[y-1][x])) count++;
        if (typeof tableStatus[y-1][x+1] !== 'undefined' && countedTile.includes(tableStatus[y-1][x+1])) count++;
        if (typeof tableStatus[y][x+1] !== 'undefined' && countedTile.includes(tableStatus[y][x+1])) count++;
    } else if (x == gridSize-1 && y == 0) {
        if (typeof tableStatus[y][x-1] !== 'undefined' && countedTile.includes(tableStatus[y][x-1])) count++;
        if (typeof tableStatus[y+1][x-1] !== 'undefined' && countedTile.includes(tableStatus[y+1][x-1])) count++;
        if (typeof tableStatus[y+1][x] !== 'undefined' && countedTile.includes(tableStatus[y+1][x])) count++;
    } else if (x == gridSize-1 && y == gridSize-1) {
        if (typeof tableStatus[y-1][x-1] !== 'undefined' && countedTile.includes(tableStatus[y-1][x-1])) count++;
        if (typeof tableStatus[y-1][x] !== 'undefined' && countedTile.includes(tableStatus[y-1][x])) count++;
        if (typeof tableStatus[y][x-1] !== 'undefined' && countedTile.includes(tableStatus[y][x-1])) count++;
    } else if (x == 0) {
        if (typeof tableStatus[y-1][x] !== 'undefined' && countedTile.includes(tableStatus[y-1][x])) count++;
        if (typeof tableStatus[y-1][x+1] !== 'undefined' && countedTile.includes(tableStatus[y-1][x+1])) count++;
        if (typeof tableStatus[y][x+1] !== 'undefined' && countedTile.includes(tableStatus[y][x+1])) count++;
        if (typeof tableStatus[y+1][x] !== 'undefined' && countedTile.includes(tableStatus[y+1][x])) count++;
        if (typeof tableStatus[y+1][x+1] !== 'undefined' && countedTile.includes(tableStatus[y+1][x+1])) count++;
    } else if (x == gridSize-1) {
        if (typeof tableStatus[y-1][x-1] !== 'undefined' && countedTile.includes(tableStatus[y-1][x-1])) count++;
        if (typeof tableStatus[y-1][x] !== 'undefined' && countedTile.includes(tableStatus[y-1][x])) count++;
        if (typeof tableStatus[y][x-1] !== 'undefined' && countedTile.includes(tableStatus[y][x-1])) count++;
        if (typeof tableStatus[y+1][x-1] !== 'undefined' && countedTile.includes(tableStatus[y+1][x-1])) count++;
        if (typeof tableStatus[y+1][x] !== 'undefined' && countedTile.includes(tableStatus[y+1][x])) count++;
    } else if (y == 0) {
        if (typeof tableStatus[y][x-1] !== 'undefined' && countedTile.includes(tableStatus[y][x-1])) count++;
        if (typeof tableStatus[y][x+1] !== 'undefined' && countedTile.includes(tableStatus[y][x+1])) count++;
        if (typeof tableStatus[y+1][x-1] !== 'undefined' && countedTile.includes(tableStatus[y+1][x-1])) count++;
        if (typeof tableStatus[y+1][x] !== 'undefined' && countedTile.includes(tableStatus[y+1][x])) count++;
        if (typeof tableStatus[y+1][x+1] !== 'undefined' && countedTile.includes(tableStatus[y+1][x+1])) count++;
    } else if (y == gridSize-1) {
        if (typeof tableStatus[y-1][x-1] !== 'undefined' && countedTile.includes(tableStatus[y-1][x-1])) count++;
        if (typeof tableStatus[y-1][x] !== 'undefined' && countedTile.includes(tableStatus[y-1][x])) count++;
        if (typeof tableStatus[y-1][x+1] !== 'undefined' && countedTile.includes(tableStatus[y-1][x+1])) count++;
        if (typeof tableStatus[y][x-1] !== 'undefined' && countedTile.includes(tableStatus[y][x-1])) count++;
        if (typeof tableStatus[y][x+1] !== 'undefined' && countedTile.includes(tableStatus[y][x+1])) count++;
    }
    return count;
}

function addRule(id) {
    if ($("#"+id).children("ul").children("li").length < 16) {
        var rule = $("#ruleTemplate").clone().removeAttr("id").show();

        rule.find("img").click(function() {
            $(this).parent().remove()
        })

        $("#"+id).children("ul").append(rule)
    }
}

function saveRules() {
    var tilesFinalsCopy = tilesFinals;

    tilesFinalsCopy.forEach(function(element) {
        element.change = [];
        var rules = $("#"+element.name).children("ul").children("li")
        rules.each(function() {
            element.change.push({
                numberOfNeib : $(this).children()[1].value,
                nextState : correspondance[$(this).children()[0].value]
            })
        })
    })

    tilesFinals = tilesFinalsCopy;
}