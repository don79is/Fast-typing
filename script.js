var FastTyping = function () {
    const STATE_REGISTER = 'register';
    const STATE_LEVEL_SELECTION = 'choose_level';
    const STATE_GAME = 'game';
    const STATE_GAME_OVER = 'game_over';

    var name,                                               //for later use in RegisterLogics
        lastState,                                           //for later use in switch
        level,
        game_time,
        start_time,
        score = 0,
        ScoreData,
        duration,
        average_speed;

    //---------------------------------------------------- Register ---------------------------------------------------------

    var RegisterLogics = function () {
        var view = $('#register');                      //jquery object created, now we can use jquery functions
        var input = $('#name');
        var button = $('#go');

        this.show = function () {                       //it's possible tu use it like public because of THIS
            view.removeClass('hidden');                 //removes hidden class (from bootstrap) that you could see the view
            enable();
        };

        this.hide = function () {                       //removed before, now we need to add the same class
            view.addClass('hidden');
            disable();
        };

        /**
         * will be checking the value.length of input and will activate the button after
         */
        function enable()                               //will be used with show cuz it enables the button after
        {
            input.keyup(function () {
                if (input.val().length >= 3) {
                    button.attr('disabled', false);
                } else {
                    button.attr('disabled', true);
                }
            });

            button.click(function () {
                name = input.val();
                changeState(STATE_LEVEL_SELECTION)
            });
        }

        function disable() {
            input.unbind();
            button.unbind();
            input.val('');
        }
    };

    /** initializing object. now u can call it with this variable. it's prepared for using in switch.
     * possible to create object only after describing function name.
     * @type {RegisterLogics}
     */
    var register = new RegisterLogics();

    //---------------------------------------------------------- Select Level ----------------------------------------------------------------

    var LevelSelectionLogics = function () {
        var view = $('#level-select');                                                         //jquery object created, now we can use jquery functions
        var button = $('#play');


        this.show = function () {                                                        //it's possible tu use it like public because of THIS
            view.removeClass('hidden');                                                  //removes hidden class (from bootstrap) that you could see the view
            $('#gamerName').html(name);
            enable();
        };

        this.hide = function () {                                                   //removed before, now we need to add the same class
            view.addClass('hidden');
            disable();
        };

        /** var level with checkbox value defined by them names;
         * enables chosen inputs value and changes state
         */
        function enable() {
            button.click(function () {
                level = $('input[name = optionsRadios]:checked').val();
                changeState(STATE_GAME)
            });
        }

        function disable() {
            button.unbind();
        }
    };

    var levelSelection = new LevelSelectionLogics();

    //---------------------------------------------------------------- THE GAME ----------------------------------------------------------

    var GameLogics = function () {
        var view = $('#game'),
            letters = 'abcdefghijklmnprstuvwxyz',
            gamer = $('#gamer'),
            letter_show  = $('#point'),
            is_golden,
            end_time,
            letter_click,
            userInput = true,
            letterKey,
            timeOut,
            letter_show_now,
            amount,
            livesCount;


        this.show = function () {
            view.removeClass('hidden');
            livesCount = 3;
            score = 0;
            gamer.html(name);
            changeLetter();
            enable();
        };

        this.hide = function () {
            view.addClass('hidden');
            disable();
        };

        function updateScore() {

            if ((score % 20) === 0 && score !== 0) {
                livesCount += 1;
                $('#live').html(livesCount);
            }
            if (is_golden) {
                is_golden = false;
                for (var i = 0; i < 5; i++) {
                    updateScore();
                }
            } else {
                score += 1;
            }
            $('#score').html(score);

        }

        /**
         * if live is 0, redirects to game over state
         */

        function removeLive() {

            livesCount -= 1;
            $('#live').html(livesCount);

            if (livesCount === 0) {
                end_time = Date.now();
                changeState(STATE_GAME_OVER);
            }
        }

        function enable() {

            $(window).keydown(
                function () {
                    letter_show.addClass('active')
                });

            $(window).keyup(
                function (e) {
                    letter_show.removeClass('active')
                    if (e.key === letters[letterKey]) {
                        updateScore();
                    } else {
                        removeLive();
                    }
                    letter_click = Date.now();


                    userInput = true;
                    changeLetter();
                })
        }
        function disable() {
            $(window).unbind();
            clearTimeout(timeOut);
        }

        function changeLetter() {


            if (!userInput) {
                removeLive()
            }
            clearTimeout(timeOut);

            if (livesCount <= 0)
                return;

            if (Math.random() < 0.1) {
                is_golden = true;
                letter_show.addClass('golden');
            } else {
                is_golden = false;
                letter_show.removeClass('golden');
            }

            userInput = false;
            letterKey = Math.round(Math.random() * (letters.length - 1))
            letter_show.html(letters[letterKey]);
            letter_show_now = Date.now();
            timeOut = setTimeout(changeLetter, level * 1000);
        }
    };

    var game = new GameLogics();

    //-------------------------------------------------------------- Game Over -------------------------------------------------

    var GameOverLogics = function () {

        var view = $('#over');
        var lastText = 'Oops.. you just lost the game:)';
        var again = $('#again');

        this.show = function () {
            view.removeClass('hidden');

        };

        this.hide = function () {
            view.addClass('hidden')
        };


        $('#textOver').html(lastText);

        again.click(function () {
            changeState(STATE_REGISTER)
        });
    };

    var gameOver = new GameOverLogics();

    //----------------------------------------------------------------- Changing a state ---------------------------------------

    function changeState(value) {

        if (lastState) {
            lastState.hide();
        }

        switch (value) {
            case STATE_REGISTER:
                lastState = register;                        //register was created before as object and we're calling it with lastState for using show() later.

                break;

            case STATE_LEVEL_SELECTION:

                lastState = levelSelection;                    //new state requires new last state value, otherwise it will show te same (register)

                break;

            case STATE_GAME:
                lastState = game;
                break;

            case STATE_GAME_OVER:
                lastState = gameOver;
                break;
        }

        lastState.show();
        console.log('changing', lastState);
    }


    /**
     * initializing first state
     */
    changeState(STATE_REGISTER);
};
