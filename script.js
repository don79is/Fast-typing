/**
 * Created by Donatas Tumanas on 2017-08-01.
 */
var FastTyping = function () {

    var STATE_REGISTER = 'reg',
        STATE_LEVEL = 'level',
        STATE_GAME = 'game',
        STATE_GAME_OVER = 'game_over';
    var name;
    var last_state;

    var RegisterLogic = function () {

        var view = $('#register');
        var input = $('#first-register');
        var button = $('#btn-go');


        this.show = function () {

            view.removeClass('hidden');
            enable();
        };

        this.hide = function () {
            view.addClass('hidden');
            disabled();
        };

        function enable() {
            input.keyup(function () {
                if (input.val().length > 3) {
                    button.attr('disabled', false).removeClass("btn btn-danger").addClass("btn btn-success");

                } else {
                    button.attr('disabled', true).removeClass("btn btn-success").addClass("btn btn-danger");
                }
                button.click(function () {
                    name = input.val();
                    changeState(STATE_LEVEL);

                })
            });

        }

        function disabled() {

            input.unbind();
            button.unbind();
            input.val("");
        }
    };
    var register = new RegisterLogic();


    var LevelLogic = function () {

        var view = $('#level-select');
        var input = $('#btn-level');

        this.show = function () {
            view.removeClass('hidden').prepend('<h4>' + name + '</h4>');
            selectDificulty()
        };

        this.hide = function () {

            view.addClass('hidden');
            disableLevel()

        };
        function selectDificulty() {

            input.click(function () {
                level = $('input[name=play]:checked').val();
                changeState(STATE_GAME);
            });

        }

        function disableLevel() {
            input.unbind();
            // level = $('input[name = gamePlay]').val('');
        }

    };
    var level = new LevelLogic();


    var GameLogic = function () {

        var view = $('#game');
        var letters = 'abcdefghijklmnopqrstuvwxyz',
            timeOut,
            letterKey,
            letterShow = $('h2'),
            lifeCount,
            userInput,
            gamer =$('#gamer'),
            letterAppearance,
            keyUpTime,
            timeAmount,
            isGolden;


        this.show = function () {

            gamer.html(name);
            lifeCount = 3;
            $('#life').html(lifeCount);
            userInput = true;
            score = 0;
            view.removeClass('hidden').prepend('<h6>' + name + ' have ' + level + ' s</h6>');
            changeLetter();
            enable();

        };
        this.hide = function () {

            view.addClass('hidden');
            disabled();

        };

        function updateScore() {

            if (isGolden) {
                isGolden = false;
                for (i = 0; i < 5; i++) {
                    updateScore();
                }
            } else {
                score += 1;
            }

            if (score % 20 === 0) {

                lifeCount += 1;
                $('#life').html(lifeCount);
            }

            $('#score').html(score);
        }

        function enable() {
            $(window).keyup(
                function (e) {

                    if (e.key === letters[letterKey]) {
                        updateScore()
                    } else {
                        removeLife()
                    }

                    keyUpTime = Date.now();

                    userInput = true;
                    changeLetter();

                    timeAmount = (letterAppearance - keyUpTime);
                    console.log(keyUpTime, letterAppearance, timeAmount);

                }
            )
        }

        function removeLife() {

            lifeCount -= 1;
            $('#life').html(lifeCount);

            if (lifeCount <= 0)
                changeState(STATE_GAME_OVER);
        }

        function changeLetter() {


            if (!userInput) {
                removeLife();
            }
            clearTimeout(timeOut);


            if (lifeCount <= 0) {
                return;

            }
            if (Math.random() < 0.1) {
                isGolden = true;
                letterShow.addClass('golden');

            } else {
                isGolden = false;
                letterShow.removeClass('golden');
            }
            userInput = false;
            timeOut = setTimeout(changeLetter, level * 1000);
            letterKey = Math.round(Math.random() * (letters.length - 1));
            letterShow.html(letters[letterKey]);

            letterAppearance = Date.now();
        }

        function disabled() {
            $(window).unbind();
            clearTimeout(timeOut);
        }
console.log(letters);

    };
    var game = new GameLogic();

    var GameOverLogic = function () {

        var view = $('#game-over');
        var input = $('#btn-over');

        this.show = function () {

            view.removeClass('hidden');
            // $('#final-score').html(score);


        };
        this.hide = function () {

            view.addClass('hidden');
            disabled();

        };

        input.click(function () {
            changeState(STATE_REGISTER);
        });
        function disabled() {
            // name = '';
            // score = 0;
            // level = null;

        }
    };
    var game_over = GameOverLogic();

    function changeState(value) {
        if (last_state) {
            last_state.hide()
        }
        switch (value) {
            case  STATE_REGISTER:
                last_state = register;

                break;

            case STATE_LEVEL:
                last_state = level;

                break;

            case STATE_GAME:
                last_state = game;

                break;

            case STATE_GAME_OVER:
                last_state = game_over;

                break;
        }

        last_state.show();
        console.log(last_state);
    }



    changeState(STATE_REGISTER);
};
