// 1st Module which control Budget or we can  say BudgetController
// This varirable is going to be an immediately-invoke function Expression.

/*************************************************/
//Budget controller
/*************************************************/

//Budget controller

var BudgetController = (function () {

    //These code for explanation only about the clousers and IIFE.
    /*var X =23;
     var add = function(a){
         return X+a;
      }
      return{
         publictest:function(b){
             return add(b)
         }
     }*/


    // some code.
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage=-1;
    };


    Expense.prototype.calcPercentages=function(totalIncome){
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100)
        }else{
            this.percentage=-1;
        } 
    };
    Expense.prototype.getPercentages=function(){
        return this.percentage;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal=function(type){
        var sum =0;
        data.allitems[type].forEach(function(curr){
            sum+=curr.value;
        });
        data.total[type]=sum;
    };
    var data = {
        allitems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget:0,
        percentage:-1
    };
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            //create new ID
            if (data.allitems[type].length > 0) {
                ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //create new item based on 'inc'or 'exp' type.
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push it into our data structure
            data.allitems[type].push(newItem);

            //return the new element.
            return newItem;

        },
        deleteItem:function(type, id){
            var ids,index;
            ids=data.allitems[type].map(function(current){
                return current.id;
            });
            index=ids.indexOf(id);

            if(index !==-1){
                data.allitems[type].splice(index,1);
            };
        },

        calculateBudget:function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate the Budget:income-expenses
            data.budget=data.total.inc-data.total.exp;
            //calculate the percentage of income that we spent
            if(data.total.inc>0){
                data.percentage=Math.round((data.total.exp/data.total.inc)*100);
            }else{
                data.percentage=-1;
            }
    
        },
        calculatePercentages:function(){
            /*
            eg:- 
            a=20
            b=10
            c=40
            Totalincome=100
            a=20/100=20%
            b=10/100=10%
            c=40%
            */
           data.allitems.exp.forEach(function(current){
            current.calcPercentages(data.total.inc);
           });
        },
        getPercentages:function(){
            var allPerc=data.allitems.exp.map(function(cur){
                return cur.getPercentages();
            });
            return allPerc;
        },
        getBudget:function(){
            return{
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            };
        },
        testing: function () {
            console.log(data);
        }
    }

})();


/************************************************/
//UI Controller
/************************************************/


//UI Controller.

var UIController = (function () {

    var Domstrings = {
        inputType: '.add__type',
        inputdescriptions: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel:".budget__value",
        incomeLabel:".budget__income--value",
        expensesLabel:".budget__expenses--value",
        percentageLabel:".budget__expenses--percentage",
        container:".container",
        expensesPercLabel:".item__percentage",
        dateLabel:".budget__title--month"
    };
    var formatNumber =function(num,type){
        var numSplit, int, dec,type;
        /* + or - before number exacty 2 decimal points
        and coma separating the thousands
        */
        num = Math.abs(num);
        num = num.toFixed(2);
        
        numSplit = num.split(".");

        int = numSplit[0];
        if(int.length>3){
            int=int.substr(0,int.length-3)+ ','+ int.substr(int.length-3,int.length);
            // input is 2310, output will 2,310
        }
        dec = numSplit[1];
        return(type ==='exp'?sign='-':'+') + ' ' + int +'.' + dec;
    };

    var nodeListforEach=function(list,callback){
        for(var i=0;i<list.length;i++){
            callback(list[i],i);
        }
    };

    return {
        getinput: function () {
            return {
                type: document.querySelector(Domstrings.inputType).value, //Will be either inc or exp.
                description: document.querySelector(Domstrings.inputdescriptions).value,
                value:parseFloat(document.querySelector(Domstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, newhtml;
            //create html string with placeholder text
            if (type === 'inc') {
                element = Domstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = Domstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace the placeholder text with some actual data

            newhtml = html.replace('%id%', obj.id);
            newhtml = newhtml.replace('%des%', obj.description);
            newhtml = newhtml.replace('%value%', formatNumber(obj.value,type));

            //Insert the Html in to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

        },
        deleteListitem:function(selectorID){
                var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearFilds:function(){
            var fields,fieldsArr;
           fields= document.querySelectorAll(Domstrings.inputdescriptions+','+Domstrings.inputValue);
            
           fieldsArr= Array.prototype.slice.call(fields);
        fieldsArr.forEach(function(current,index,array) {
            current.value="";
        });

        fieldsArr[0].focus();
        
        },
        displayBudget:function(obj){
            var type;
            obj.budget>0 ? type='inc':type='exp';
            document.querySelector(Domstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(Domstrings.incomeLabel).textContent=formatNumber(obj.budget,'inc');
            document.querySelector(Domstrings.expensesLabel).textContent=formatNumber(obj.budget,'exp');
            if(obj.percentage>0){
                document.querySelector(Domstrings.percentageLabel).textContent=obj.percentage+'%';
            }else{
                document.querySelector(Domstrings.percentageLabel).textContent='---';
            }


        },
        displayPercentages:function(percentages){
            var fields=document.querySelectorAll(Domstrings.expensesPercLabel);
        
            nodeListforEach(fields,function(current,index){
                if(percentages[index]>0){
                    current.textContent=percentages[index] + '%';
                }else{
                    current.textContent='---'
                }
               
            });

        },
        displayMonth:function(){
            var now,months,month,year;
            now = new Date();
            year=now.getFullYear();
            months=['january','February','March','April','May','June','July','August','September','October','November','December'];
            month=now.getMonth();

            document.querySelector(Domstrings.dateLabel).textContent= months[month] + ' ' + year;
        },

        changedType:function(){
            var fields = document.querySelectorAll(Domstrings.inputType + ',' + Domstrings.inputdescriptions + ',' + Domstrings.inputValue);
            nodeListforEach(fields,function(curr){
                curr.classList.toggle('red-focus');
            });
           // document.querySelector(Domstrings.inputType).classList.toggle('red-focus');
            //document.querySelector(Domstrings.inputdescriptions).classList.toggle('red-focus');
            //document.querySelector(Domstrings.inputValue).classList.toggle('red-focus');
            document.querySelector(Domstrings.inputBtn).classList.toggle('red');
        },
        getDomstrings: function () {
            return Domstrings;
        }

    };

})();


/********************************************************/
//Global App conroller
/********************************************************/


//Datamoduler or app controller.
//Global App conroller.

var Controller = (function (budgetctrl, UIctrl) {

    var setupEventListeners = function () {

        var DOM = UIctrl.getDomstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrladdItem);

        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrladdItem();
            }

        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeletItem);

        document.querySelector(DOM.inputType).addEventListener('change',UIctrl.changedType);

    };
    var updateBudget=function(){
        //1. calculate the Budget 
        budgetctrl.calculateBudget();
        //2.return the budget
        var budget=budgetctrl.getBudget();
        //3. Display the budget on the UI.
        UIctrl.displayBudget(budget);
    };

    var updatePercentages=function(){
        //1. Claculate the percentages
        budgetctrl.calculatePercentages();
        //2. Read percentages from the budget controller
        var percentages= budgetctrl.getPercentages();
        //3.update the UI with the new percentages
        UIctrl.displayPercentages(percentages);
    };

    var ctrladdItem = function () {
        var input, newItem
        //1. Get the field input data.
        input = UIctrl.getinput();
        if (input.description!==""&& !isNaN(input.value)&& input.value>0){
            //2.Add the item to the budget controller.
            newItem = budgetctrl.addItem(input.type, input.description, input.value);
            //3.Add the item to the UI.
            UIctrl.addListItem(newItem, input.type);
            //4. clear the fields
            UIctrl.clearFilds();
            //5.calculate and update Budget
            updateBudget();
            //6. Calculate and update percentages
            updatePercentages();
        }
        
    };
    var ctrlDeletItem=function(event){
        var itemID, splitID,type,ID ;
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            //inc-1
            splitID = itemID.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);
            //1. delete the item from the data structure
            budgetctrl.deleteItem(type,ID);
            //2. delete the itemm form the UI
            UIctrl.deleteListitem(itemID);
            //3.update and show the new budget
            updateBudget();
            //4. Calculate and update percentages
            updatePercentages();

        }
    };
    return {
        init: function () {
            console.log("Application Work.");
            UIctrl.displayMonth();
            UIctrl.displayBudget({budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            });
            setupEventListeners();
        }
    }
    //These code for explanation only about the clousers and IIFE.
    //And how to make connection between other modules.
    /*var z=budgetctrl.publictest(5);
    return {
        anotherpublic:function(){
            console.log(z);
        }
    }*/

    // Function in which all event listeners
})
    (BudgetController, UIController);

Controller.init();











