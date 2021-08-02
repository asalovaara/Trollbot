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

# Used if and only if the bot begins the conversation.
# Not currently in use.
class ActionBotOpening(Action):

    def name(self) -> Text:
        return "action_greet_users"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
                response="utter_introduction"
            )

        return [UserUtteranceReverted()]

# Ends the introduction phase and marks the task phase active
# by setting the task_activated slot to True
class ActionSetTaskSlot(Action):

    def name(self) -> Text:

        return "action_set_task_slot"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        return [SlotSet("task_activated", True)]

# Ends the conversation phase and marks the decision phase
# by setting the decision_phase slot to True
class ActionSetDecisionPhase(Action):

    def name(self) -> Text:

        return "action_set_decision_phase"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        return [SlotSet("decision_phase", True)]

# Uses the API call to get one genre of the artist in the artist slot,
# then stores it in the genre slot
class ActionSetGenreSlot(Action):

    def name(self) -> Text:

        return "action_set_genre_slot"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        artist = tracker.get_slot('artist')

        new_artist = tracker.get_latest_entity_values('artist')

        if new_artist is None:
            return []
        else:
            genre = requests.get('http://localhost:3001/api/trollbot/genre/' + new_artist)
            genre = genre.json()
            return [SlotSet("genre", genre)]

# Bot utters a greeting.
# Greets the user by name if the name slot contains it
# Otherwise greets without a name
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

# Sets the opinion slot's value as "good"
# Used when the user suggests, likes or praises an artist.
class ActionSetOpinionSlotAsGood(Action):

    def name(self) -> Text:

        return "action_set_opinion_slot_as_good"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        return [SlotSet("opinion", "good")]

# Sets the opinion slot's value as "bad"
# Used when the user dislikes or dismisses an artist.
class ActionSetOpinionSlotAsBad(Action):

    def name(self) -> Text:

        return "action_set_opinion_slot_as_bad"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        return [SlotSet("opinion", "bad")]

# TROLL
# Used when a user asks the trollbot for its opinion
# if the user has not expressed any opinions yet (opinion slot does not contain an opinion value),
# then the bot deflects the question by saying it does not know yet.
# Otherwise the bot deflects the question by insulting the user based on the opinion they last expressed.
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

# TROLL
# Used when the user makes a claim or expresses an opinion on an artist.
# If the artist slot is unfilled (i.e. the user says something like "she is so cool" without clarifying the artist first),
# then the bot asks the user to clarify who the user is talking about.
# Otherwise the bot insults the expressed opinion.
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

# Used when the decision phase is concluded. In the future will probably send the decision forward immediately or something.
# Sets the final_decision slot by filling it with the latest value in the artist slot.
class ActionPostDecision(Action):
    def name(self) -> Text:

        return "action_post_decision"
    
    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        artist = tracker.get_slot('artist')

        return [SlotSet("final_decision", artist)]

# Used in debugging or (currently) when the conversation ends. Likely will not be in the final product.
# Resets the conversation.
class ActionEndConversation(Action):
    def name(self) -> Text:

        return "action_end_conversation"
    
    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
    
        dispatcher.utter_message("Conversation restarting.")

        return [Restarted()]

# Increases the reacted_users slot.
# Used when at least one piece of input is required from all users before advancing in the conversation.
class ActionUserReacted(Action):
     def name(self) -> Text:

        return "action_user_reacted"
    
    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
    
        reacted_users = tracker.get_slot('reacted_users')
        

        if reacted_users < 2:
            amt = reacted_users + 1
            return [SlotSet('reacted_users', amt)]
        else:
            reset_amt = SlotSet('reacted_users', 0)
            advance_phase = SlotSet('introduction_phase', false)
            if tracker.get_slot('introduction_phase') == false:
                advance_phase = SlotSet('task_activated', true)
                if tracker.get_slot('task_activated') == true:
                    advance_phase = SlotSet('decision_phase', true)
            return [reset_amt, advance_phase]

