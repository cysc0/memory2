defmodule MemoryWeb.GamesChannel do
    use MemoryWeb, :channel
  
    alias Memory.Game
  
    # Source: Nat Tuck - https://github.com/NatTuck/hangman-2019-01/blob/422f1b60ef5d4b51afe20ec65f7d30746ef11f82/lib/hangman_web/channels/games_channel.ex
    def join("games:" <> name, payload, socket) do
      if authorized?(payload) do
        game = Game.new()
        socket = socket
        |> assign(:game, game)
        |> assign(:name, name)
        {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
      else
        {:error, %{reason: "unauthorized"}}
      end
    end
  
    def handle_in(xxx, socket) do
        # TODO:
    end
  
    # Add authorization logic here as required.
    defp authorized?(_payload) do
      true
    end
  end