# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions

import datetime

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import Restarted
from rasa_sdk.events import UserUtteranceReverted
from rasa_sdk.events import SlotSet
from rasa_sdk.events import ReminderScheduled
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

class ActionSetDecisionPhase(Action):

    def name(self) -> Text:

        return "action_set_decision_phase"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        return [SlotSet("decision_phase", True)]

class ActionSetGenreSlot(Action):

    def name(self) -> Text:

        return "action_set_genre_slot"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        """Sets the genre of the artist currently in the artist slot and stores the information in the artists slot."""
        try:

            artist = tracker.get_slot('artist')
            artists = tracker.get_slot('artists')
            try:
                genre = requests.get('http://localhost:3001/api/trollbot/genre/' + artist)
                genre = genre.json()
            except Exception as e:
                print(e)
                genre = 'default'
            print('genre: ' + genre)
            if artist not in artists:
                artists[artist] = {}
            artists[artist]['genre'] = genre
        except Exception as e:
            genre = 'default'
            print("An error occurred during action_set_genre_slot:")
            print(e)

        return [SlotSet("genre", genre), SlotSet("artists", artists)]

class ActionGreetUserByName(Action):

    def name(self) -> Text:

        return "action_greet_user_by_name"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        name = tracker.get_slot('name')

        if name is None:
            dispatcher.utter_message(
                response="utter_opening"
            )
            return []
        else:
            dispatcher.utter_message(
                response="utter_nice_to_meet_you_name"
            )
            return []

class ActionSetOpinionSlotAsGood(Action):

    def name(self) -> Text:

        return "action_set_opinion_slot_as_good"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        return [SlotSet("opinion", "good")]

class ActionSetOpinionSlotAsBad(Action):

    def name(self) -> Text:

        return "action_set_opinion_slot_as_bad"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        return [SlotSet("opinion", "bad")]

class ActionDeflectOpinionQuestion(Action):

    def name(self) -> Text:

        return "action_deflect_opinion_question"
    
    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        opinion = tracker.get_slot('opinion')
        
        if opinion is None:
            dispatcher.utter_message(
                response="utter_idk"
            )
            return []
        elif opinion == "good":
            dispatcher.utter_message(
                response="utter_insult_for_likes"
            )
            return []
        elif opinion == "bad":
            dispatcher.utter_message(
                response="utter_insult_for_dislikes"
            )
            return []
        else:
            dispatcher.utter_message(
                response="utter_idk"
            )
            return []

class ActionHandleClaim(Action):
    def name(self) -> Text:

        return "action_handle_claim"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        artist = tracker.get_slot('artist')

        if artist is None:
            dispatcher.utter_message(
                response="utter_ask_clarification_of_artist"
            )
            return [SlotSet("opinion", None)]
        else:
            dispatcher.utter_message(
                response="utter_reject_claim"
            )
            return []
    
class ActionSetArtistForUser(Action):
    
    def name(self) -> Text:
        return "action_set_artist_for_user"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        last_message_sender = tracker.get_slot('last_message_sender')
        users = tracker.get_slot('users')
        artist = tracker.get_slot('artist')
        opinion = tracker.get_slot('opinion')

        if artist:
            if opinion == "good":
                users[last_message_sender]['liked_artist'] = artist
            elif opinion == "bad":
                users[last_message_sender]['disliked_artist'] = artist
            return [SlotSet("users", users)]
        else:
            return

class ActionPostDecision(Action):
    def name(self) -> Text:

        return "action_post_decision"
    
    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        artist = tracker.get_slot('artist')

        return [SlotSet("final_decision", artist)]

class ActionEndConversation(Action):
    def name(self) -> Text:

        return "action_end_conversation"
    
    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
    
        dispatcher.utter_message("Conversation restarting.")

        return [Restarted()]

class checkUsersActiveUserSlot(Action):
    def name(self) -> Text:

        return "action_check_users_active_user_slot"
    
    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        """Sets the active_user slot to true if the last_message sender is the active user."""
    
        users = tracker.get_slot('users')
        last_message_sender = tracker.get_slot('last_message_sender')
        if last_message_sender:
            if users[last_message_sender]['active']:
                print('Setting active_user as True.')
                return [SlotSet('active_user', True)]
            else:
                print('Setting active_user as False.')
                return [SlotSet('active_user', False)]
        print('Last_message_sender not found.')
        return [SlotSet('active_user', False)]
        
