# https://rasa.com/docs/rasa/custom-actions

from typing import Dict, Text, List, Optional, Any

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.forms import FormValidationAction
from rasa_sdk.events import FollowupAction, UserUtteranceReverted, SlotSet, ReminderScheduled, ReminderCancelled
from rasa_sdk.types import DomainDict
import requests
import datetime
import os

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

# Uses the API call to get one genre of the artist in the artist slot,
# then stores it in the genre slot
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
            # latest message's artist entity extracted by DIETClassifier. index 1 would be RegexEntityClassifier's artist entity
            new_artist = tracker.latest_message['entities'][0]['value']
            # new_artist used instead of artist so that artists not in the lookup table can be searched
            try:
                BACKEND_API_URL = 'localhost'
                if 'BACKEND_API_URL' in os.environ:
                    BACKEND_API_URL = os.environ.get('BACKEND_API_URL')
                
                genre = requests.get('http://' + BACKEND_API_URL + ':3001/api/trollbot/genre/' + new_artist)
                genre = genre.json()
            except Exception as e:
                print(e)
                genre = None
            print('genre: ' + genre)
            if new_artist not in artists:
                artists[new_artist] = {}
            artists[new_artist]['genre'] = genre
        except Exception as e:
            genre = None
            print("An error occurred during action_set_genre_slot:")
            print(e)

        return [SlotSet("genre", genre), SlotSet("artists", artists), SlotSet("artist", new_artist)]

# Bot utters a greeting.
# Greets the user by name if the user's name is set in the users slot.
# Otherwise greets without a name
class ActionGreetUserByName(Action):

    def name(self) -> Text:

        return "action_greet_user_by_name"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        users = tracker.get_slot('users')
        last_message_sender = tracker.get_slot('last_message_sender')
        print(users)
        print(last_message_sender)
        if users[last_message_sender]['name'] is None:
            dispatcher.utter_message(
                response="utter_opening"
            )
            return []
        else:
            print(users[last_message_sender]['name'])
            
            dispatcher.utter_message(
                response="utter_nice_to_meet_you_name",
                name=users[last_message_sender]['name']
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
        
# Utter artist dismissal depending on whether some chatter has already suggested an artist.
class dismissArtist(Action):
    def name(self) -> Text:

        return "action_dismiss_artist"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        print("Entered action_dimiss_artist")
        users = tracker.get_slot('users')
        last_message_sender = tracker.get_slot('last_message_sender')
        for user in users:
            print(user)
            print(users[user])
            if user != last_message_sender and 'liked_artist' in users[user] and users[user]['liked_artist'] is not None and user != last_message_sender:
                dispatcher.utter_message(response="utter_artist_dismissal_multiuser", 
                name=users[user]['name'])
                return []
        
        dispatcher.utter_message(response="utter_artist_dismissal")
        return []


class checkIfSameLikedArtist(Action):
    def name(self) -> Text:

        return "action_check_if_same_liked_artist"

    def run(self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        liked_artist = ''
        users = tracker.get_slot('users')
        for user in users:
            if 'liked_artist' in users[user]:
                if liked_artist == '':
                    liked_artist = users[user]['liked_artist']
                elif users[user]['liked_artist'] != liked_artist:
                    return [SlotSet('same_artist_liked', True)]
        return [SlotSet('same_artist_liked', False)]