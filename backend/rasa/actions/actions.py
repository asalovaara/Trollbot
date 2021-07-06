# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import UserUtteranceReverted
from rasa_sdk.events import SlotSet
import requests

class ActionBotOpening(Action):

    def name(self) -> Text:
        return "action_greet_users"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Hello, I am Bot!")

        return [UserUtteranceReverted()]

class ActionSetTaskSlot(Action):

    def name(self) -> Text:

        return "action_set_task_slot"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        return [SlotSet("task_activated", True)]

class ActionSetGenreSlot(Action):

    def name(self) -> Text:

        return "action_set_genre_slot"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        artist = tracker.get_slot('artist')

        genre = requests.get('http://localhost:3001/api/trollbot/genre/' + artist)
        genre = genre.json()

        return [SlotSet("genre", genre)]
