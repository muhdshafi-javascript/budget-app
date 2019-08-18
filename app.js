//BUDGET controller
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }

    }
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: -1,
        percentage: -1
    }

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (curr) {
            sum += curr.value;
        });
        data.totals[type] = sum;
    }

    return {
        addItem: function (type, description, value) {
            var newItem, newId;
            if (data.allItems[type].length > 0) {
                newId = type + '-' + data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                newId = type + '-' + 0;
            }

            if (type === 'inc') {
                newItem = new Income(newId, description, value);
            } else if (type === 'exp') {
                newItem = new Expense(newId, description, value);
            }
            //add the element to list
            data.allItems[type].push(newItem);
            //return the element 
            return newItem;
        },

        deleteItem: function (type, id) {
            var index = -1;
            data.allItems[type].forEach(function (current, i) {
                if (current.id === id) {
                    index = i;
                    return;
                }
            });
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function () {
            //Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            //Calculate th budget : income - expenses
            data.budget = data.totals['inc'] - data.totals['exp'];

            //calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }

        },

        getBudget: function () {
            return {
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        },

        calculateIndividualPercentages: function () {
            data.allItems['exp'].forEach(function (current) {
                current.calculatePercentage(data.totals['inc']);
            });
        },

        getIndividualPercentages: function () {
            return data.allItems.exp.map(function (current) {
                return current.getPercentage();
            });
        },

        test: function () {
            console.log(data);
        }
    }

})();

//UI controller
var UIController = (function () {

    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        commonContainer: '.container',
        individualPercentLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        inputType: '.add__type'
    }

    var formatNumber = function (num) {
        return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    //utility funtion to iterate over node list, 
    //previously we used a hack, used slice() and converted to Array.
    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
            }
        },
        addListItem: function (obj, type) {
            var html, updatedHtml, element;
            //Create HTML string with placeholder text.
            if (type === 'inc') {
                element = domStrings.incomeContainer;
                html = `<div class="item clearfix" id="%id%">
                            <div class="item__description">%description%</div>
                            <div class="right clearfix">
                                <div class="item__value">+ %value%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`
            } else if (type === 'exp') {
                element = domStrings.expenseContainer;
                html = `<div class="item clearfix" id = "%id%" >
                            <div class="item__description">%description%</div>
                            <div class="right clearfix">
                                <div class="item__value">- %value%</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div >`
            }

            //Replace the place holder with data.
            updatedHtml = html.replace('%id%', obj.id);
            updatedHtml = updatedHtml.replace('%description%', obj.description);
            updatedHtml = updatedHtml.replace('%value%', formatNumber(obj.value));

            //Insert the HTML into the DOM.
            document.querySelector(element).insertAdjacentHTML('beforeend', updatedHtml);

        },

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(domStrings.inputDescription + ',' + domStrings.inputValue);
            //convert list to array (using slice() on array to do that)
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (field, index, array) {
                field.value = '';
            });
            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {
            document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget);
            document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalIncome);
            document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalExpenses);
            if (obj.percentage > 0) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(domStrings.percentageLabel).textContent = '--';
            }

        },

        deleteListItem: function (id) {
            var item = document.getElementById(id);
            item.parentNode.removeChild(item);
        },

        displayIndidualPercentage: function (percentages) {
            var fields = document.querySelectorAll(domStrings.individualPercentLabel);

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '--';
                }
            });
        },

        displayMonth: function () {
            var now = new Date();
            var value = now.toLocaleString('default', { month: 'long' }) + ' ' + now.getFullYear()
            document.querySelector(domStrings.dateLabel).textContent = value;
        },

        changeOutline: function () {
            // red for expense
            // green for income
            var fields = document.querySelectorAll(domStrings.inputType + ',' +
                domStrings.inputDescription + ',' +
                domStrings.inputValue
            );

            nodeListForEach(fields, function(current, index){
                current.classList.toggle('red-focus');
            })

            document.querySelector(domStrings.inputButton).classList.toggle('red');

        },

        getDomStrings: function () {
            return domStrings;
        }
    }

})();

//GLOBAL controller
var controller = (function (budgetCtrl, UICntrl) {

    var setUpEventListener = function () {
        var dom = UICntrl.getDomStrings();
        //add button click
        document.querySelector(dom.inputButton).addEventListener('click', ctrlAddItem);
        //on press Enter key
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });
        //delete items
        document.querySelector(dom.commonContainer).addEventListener('click', ctrlDeleteItem);

        //UI input css
        document.querySelector(dom.inputType).addEventListener('change', UICntrl.changeOutline);
    }


    var ctrlAddItem = function () {
        var input, newItem;

        //1. fetch the input data
        input = UICntrl.getInput();
        if (isNaN(input.value) || input.value == 0 || input.description === '') {
            //skip
            return;
        }

        //2. add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. add the item to the UI
        UICntrl.addListItem(newItem, input.type);

        // Clear the fields
        UICntrl.clearFields();

        //4. Calculate and update the budget
        ctrlUpdateBudget();

        //update individual %
        updateIndidualPercentage();
    }

    ctrlUpdateBudget = function () {

        //Calculate the budget
        budgetCtrl.calculateBudget();

        //Return the budget
        var budgetObj = budgetCtrl.getBudget();

        //Display the budget on the UI
        UICntrl.displayBudget(budgetObj)
    }

    ctrlDeleteItem = function (event) {
        var id, type;
        //check the target property
        id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (!id) {
            return;
        }
        type = id.split('-')[0];
        console.log(type);

        //delete the item from data structure
        budgetCtrl.deleteItem(type, id);

        //delete the item from the UI
        UICntrl.deleteListItem(id);

        //Calculate and update the budget
        ctrlUpdateBudget();

        //update individual %
        updateIndidualPercentage();

    }

    updateIndidualPercentage = function () {
        //calculate the percentages
        budgetCtrl.calculateIndividualPercentages();

        //get the percentags from budget controller
        var percentages = budgetCtrl.getIndividualPercentages()

        //Update the UI
        UICntrl.displayIndidualPercentage(percentages);
    }

    return {
        init: function () {
            console.log('Application has started...');
            UICntrl.displayMonth();
            UICntrl.displayBudget({
                budget: 0,
                totalExpenses: 0,
                totalIncome: 0,
                percentage: -1
            })
            setUpEventListener();
        }
    }

})(budgetController, UIController);

controller.init();