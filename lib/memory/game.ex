# TODO: server-side game logic here
defmodule Memory.Game do
    def new do
        %{
            board: newBoard(),
            clickCount: 0,
            register: -1
        }
    end
    
    def newBoard do
        # generate a board w/ all display states set to false
        #   double the list, shuffle the list
        board = [%{letter: "A", display: false},
        %{letter: "B", display: false},
        %{letter: "C", display: false},
        %{letter: "D", display: true},
        %{letter: "E", display: false},
        %{letter: "F", display: false},
        %{letter: "G", display: false},
        %{letter: "H", display: false}]
        board = board ++ board
        Enum.shuffle(board)
    end
    
    def client_view(game) do
        # receive the board from the game, generate a stripped skeleton
        #   and initialize clicks to 0
        # soln = game.board
        %{
            skel: strip(game.board),
            clickCount: 0
        }
    end
    
    def strip(board) do
        # iterate thru the board, if display state is true, keep the letter
        #   otherwise replace it with a blank space
        Enum.map board, fn elem ->
            if elem.display do
                elem.letter
            else
                " "
            end
        end
    end

    def guess(game, idx) do
        idx = String.to_integer(idx)
        {newElem, _} = List.pop_at(game.board, idx)
        newElem = Map.replace(newElem, :display, true)
        newBoard = List.replace_at(game.board, idx, newElem)
        if game.register === -1 do
            %{
                board: newBoard,
                clickCount: game.clickCount + 1,
                register: idx
            }
        else
            {prevGuess, _} = List.pop_at(game.board, game.register)
            if prevGuess.letter === newElem.letter do
                %{
                    board: newBoard,
                    clickCount: game.clickCount + 1,
                    register: -1
                }
            else
                {restoreElem, _} = List.pop_at(game.board, game.register)
                restoreElem = Map.replace(restoreElem, :display, false)
                %{
                    board: List.replace_at(game.board, game.register, restoreElem),
                    clickCount: game.clickCount + 1,
                    register: -1
                }
            end
        end
    end
end