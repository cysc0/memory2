defmodule MemoryWeb.GamesChannel do
    use MemoryWeb, :channel
  
    alias Memory.Game
    alias Memory.BackupAgent
  
    # Source: Nat Tuck - https://github.com/NatTuck/hangman-2019-01/blob/422f1b60ef5d4b51afe20ec65f7d30746ef11f82/lib/hangman_web/channels/games_channel.ex
    # Applies to handle_in() as well
    def join("games:" <> name, payload, socket) do
      if authorized?(payload) do
        game = BackupAgent.get(name) || Game.new()
        BackupAgent.put(name, game)
        socket = socket
        |> assign(:game, game)
        |> assign(:name, name)
        {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
      else
        {:error, %{reason: "unauthorized"}}
      end
    end
  
    def handle_in("guess", %{"idx" => idx}, socket) do
      name = socket.assigns[:name]
      game = Game.guess(socket.assigns[:game], idx)
      socket = assign(socket, :game, game)
      BackupAgent.put(name, game)
      {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
    end
  
    def handle_in("revert", %{}, socket) do
      name = socket.assigns[:name]
      game = Game.revert(socket.assigns[:game])
      socket = assign(socket, :game, game)
      BackupAgent.put(name, game)
      {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
    end
  
    def handle_in("restart", %{}, socket) do
      name = socket.assigns[:name]
      game = Game.new()
      socket = assign(socket, :game, game)
      BackupAgent.put(name, game)
      {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
    end
  
    # Add authorization logic here as required.
    defp authorized?(_payload) do
      true
    end
  end