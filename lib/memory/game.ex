# TODO: channels
defmodule Memory.Game do
    def new do
        %{
            board: newBoard(),
            clickCount: -1,
            register: []
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
            clickCount: game.clickCount + 1
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

    def revert(game) do
        if length(game.register) > 0 do
            Process.sleep(1000)
            {curReg, restReg} = List.pop_at(game.register, 0)
            {restoreElem, _} = List.pop_at(game.board, curReg)
            restoreElem = Map.replace(restoreElem, :display, false)
            newBoard = List.replace_at(game.board, curReg, restoreElem)
            {curReg, _} = List.pop_at(restReg, 0)
            {restoreElem, _} = List.pop_at(game.board, curReg)
            restoreElem = Map.replace(restoreElem, :display, false)
            newBoard = List.replace_at(newBoard, curReg, restoreElem)
            
            %{
                board: newBoard,
                clickCount: game.clickCount,
                register: []
            }
        else
            game
        end
    end


    def guess(game, idx) do
        idx = String.to_integer(idx)
        {newElem, _} = List.pop_at(game.board, idx)
        newElem = Map.replace(newElem, :display, true)
        newBoard = List.replace_at(game.board, idx, newElem)
        if length(game.register) === 0 do
            # first part of guess
            %{
                board: newBoard,
                clickCount: game.clickCount + 1,
                register: [idx]
            }
        else
            # second part of guess
            lol = List.pop_at(game.register, 0)
            {targetReg, _} = List.pop_at(game.register, 0)
            {prevGuess, _} = List.pop_at(game.board, targetReg)
            if prevGuess.letter === newElem.letter do
                # correct pair
                %{
                    board: newBoard,
                    clickCount: game.clickCount + 1,
                    register: []
                }
            else
                # incorrect pair
                {restoreReg, _} = List.pop_at(game.register, 0)
                {restoreElem, _} = List.pop_at(game.board, restoreReg)
                restoreElem = Map.replace(restoreElem, :display, false)
                %{
                    board: newBoard,
                    clickCount: game.clickCount + 1,
                    register: game.register ++ [idx]
                }
            end
        end
    end
end