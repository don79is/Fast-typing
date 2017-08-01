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

                break;
        }
        last_state.show();
    }

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

        };
        function selectDificulty() {

            input.click(function () {
               level = $('input[name=play]:checked').val();
                changeState(STATE_GAME);
            });

        }


    };
    var level = new LevelLogic();


    var GameLogic = function () {

        var view = $('#game');


        this.show = function () {

            view.removeClass('hidden')

        };
        this.hide = function () {

            view.addClass('hidden');

        };
    };

var game = new GameLogic();



    function initialize() {
        console.log()
    }


    changeState(STATE_REGISTER);
};
