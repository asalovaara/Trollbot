# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions

from typing import Dict, Text, List, Optional, Any

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.forms import FormValidationAction
from rasa_sdk.events import FollowupAction, UserUtteranceReverted, SlotSet, ReminderScheduled, ReminderCancelled
from rasa_sdk.types import DomainDict
import requests
import datetime

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

# Introduction form validation

class ValidateIntroductionForm(FormValidationAction):
    def name(self) -> Text:
        return "validate_introduction_form"
    
    def validate_introductions_finished(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:

        counter = tracker.get_slot('counter') + 1
        rounds = tracker.get_slot('number_of_users') - 1


        if counter == rounds:
            # validation passes: form deactivates and counter set to 0
            return {"introductions_finished": slot_value, "counter": 0.0}
        else:
            # validation fails: form stays active, but counter was incremented
            return {"introductions_finished": None, "counter": counter}

class ActionIncrementCounter(Action):

    def name(self) -> Text:

        return "action_increment_counter"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        counter = tracker.get_slot('counter') + 1

        return [SlotSet("counter", counter)]

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

# Sets timer for positive evaluation, killed on user message            

class ActionDelayedPositiveEvaluation(Action):

    def name(self) -> Text:
        return "action_delayed_positive_evaluation"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        date = datetime.datetime.now() + datetime.timedelta(seconds=5)

        reminder = ReminderScheduled(
            "EXTERNAL_positive_evaluation_timer",
            trigger_date_time=date,
            name="positive_evaluation_timer",
            kill_on_user_message=True,
        )

        return [reminder]

# Run when positive evaluation timer is triggered 

class ActionTriggerPositiveEvaluation(Action):

    def name(self) -> Text:
        return "action_trigger_positive_evaluation"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
            response="utter_artist_praise_agree"
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