module Main where

import Prelude

import Control.Monad.Eff.Console

import Control.Monad.Eff (Eff)
import Data.Maybe (Maybe(..))
import Node.HTTP

main = do
  server <- createServer respond
  listen server listenOptions $ void do
     log "Listening on port 8080"

listenOptions =
  { hostname: "localhost"
  , port: 8080
  , backlog: Nothing
  }

respond :: forall eff. Request -> Response -> (console :: CONSOLE, http :: HTTP | eff) Unit
respond req res = do
  log "test"
  setStatusCode res 200
{-- main :: forall eff. Eff (http :: HTTP | eff) Server --}
{-- main = --}
{--   let options = { hostname: "localhost", port: 3000, backlog: Nothing } --}
{--   in listen $ createServer (\req res -> setStatusCode res 200) $ options --}

  
