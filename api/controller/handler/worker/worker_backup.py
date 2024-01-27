import requests
import time
from .constants import REPLAY_START_RECORDING_INTERVAL_MINUTES, REPLAY_EXPORT_FOLDER, REPLAY_EXPORT_SWITCH, REPLAY_SET_SPEED_VALUE, JSON_URL, VMIX_URL, CHECK_INTERVAL_SECONDS, SLEEP_TRIGGER_DURATION, SLEEP_WINDOW_INPUT, HOMEPEN1NUM_INPUT, HOMEPEN2NUM_INPUT, AWAYPEN1NUM_INPUT, AWAYPEN2NUM_INPUT, QUICKPLAY_INPUT


class Worker:

    def __init__(self):
        self.previous_data = {
            "homescore": "0",
            "awayscore": "0",
            "HomePen1num": None,
            "homepen2num": None,
            "awaypen1num": None,
            "awaypen2number": None,
            "gameclock": None,
            "period": None
        }
        self.status = "Stopped"
        self.last_update_time = time.time()
        self.SCRIPT_IN_SLEEP_MODE = False  # to keep track if sleep mode is active
        # Initialize recording control variables
        self.last_record_time = time.time()
        # This will hold the elapsed time for a static gameclock
        self.gameclock_static_time = 0
        self.play_input_15_triggered = False  # This ensures we only play input 15 once

        self.stop = False  # Stop Trigger
        # Initial prompt to show the script has started
        print(f"Script has started. Monitoring game data...")
        print(
            f"ReplayStartRecording will execute every {REPLAY_START_RECORDING_INTERVAL_MINUTES} minutes.")
        print(f"The ReplaySetSpeed value is set to {REPLAY_SET_SPEED_VALUE}.")

        # state variables here

    def send_vmix_command(self, command, value=None):
        """
        Send a command to the vMix API.
        """
        params = {'Function': command}
        if value is not None:
            params['Value'] = value

        response = requests.get(VMIX_URL, params=params)
        if response.status_code != 200:
            print(
                f"Error: {response.status_code} {response.reason} for URL: {response.url}")
            return
        print(
            f"Sent command to vMix: {command} {f'with value {value}' if value else ''}")

    def send_vmix_commands_for_score_change(self, period, score_type):
        """
        Send a sequence of commands to vMix when a score change is detected.
        """
        if period in [1, 3]:
            channel = "ChannelA" if score_type == "homescore" else "ChannelB"
        else:
            channel = "ChannelB" if score_type == "homescore" else "ChannelA"

        # Send commands to vMix
        self.send_vmix_command(f"ReplaySelect{channel}")
        self.send_vmix_command("ReplaySetSpeed", value=REPLAY_SET_SPEED_VALUE)
        self.send_vmix_command("ReplayMarkInOut", value=7)
        time.sleep(1)  # Wait for 1 second
        if REPLAY_EXPORT_SWITCH:
            self.send_vmix_command("ReplayPlayLastEventToOutput")
            self.send_vmix_command(
                "ReplayExportLastEvent", value=REPLAY_EXPORT_FOLDER)

    def stop_script(self):
        self.stop = True

    def run(self):
        self.stop = False
        while not self.stop:
            try:
                if (JSON_URL == ""):
                    print("No JSON URL defined")
                    continue
                # Fetch the current game data
                response = requests.get(JSON_URL)
                response.raise_for_status()
                data = response.json()[0]

                # checks for sleep function
                # checking the gameclock value changes should be enough
                # if the controller is off and the value didn't change
                # for 10 min then we trigger the sleep Input ( please verify the input number on your end)
                if self.previous_data["gameclock"] == data["gameclock"] and (time.time() - self.last_update_time) > SLEEP_TRIGGER_DURATION * 60 and not self.SCRIPT_IN_SLEEP_MODE:
                    self.status = "Sleeping"
                    self.SCRIPT_IN_SLEEP_MODE = True
                    print(
                        f"Triggering Sleep input as there was no update for 10 minutes")
                    # please change the input number to the correct one here
                    vmix_response = requests.get(
                        f"{VMIX_URL}?Function=QuickPlay&Input={SLEEP_WINDOW_INPUT}")
                else:
                    self.status = "Running"
                    # Check for a change in period and print if there's a change
                    current_period = int(data["period"])
                    if self.previous_data["period"] is None or current_period != self.previous_data["period"]:
                        print(f"Period changed to: {current_period}")
                        # Update the previous period
                        self.previous_data["period"] = current_period

                    # Check for empty gameclock and trigger only once
                    if data["gameclock"] == "" and not self.play_input_15_triggered:
                        self.send_vmix_command(
                            "QuickPlay", value="Input={0}".format(QUICKPLAY_INPUT))
                        print(
                            "Detected empty gameclock. Sent command to play input 15.")
                        self.play_input_15_triggered = True
                    elif data["gameclock"] and self.play_input_15_triggered:
                        # Reset trigger if gameclock is no longer empty
                        self.play_input_15_triggered = False

                    # Check if it's time to start recording again
                    if time.time() - self.last_record_time > REPLAY_START_RECORDING_INTERVAL_MINUTES * 60:
                        self.send_vmix_command("ReplayStartRecording")
                        print(
                            f"ReplayStartRecording command sent at {time.strftime('%Y-%m-%d %H:%M:%S')}")
                        self.last_record_time = time.time()

                    # Check penalties for the first change
                    if self.previous_data["HomePen1num"] == "" and data["HomePen1num"] != "":
                        vmix_response = requests.get(
                            f"{VMIX_URL}?Function=QuickPlay&Input={HOMEPEN1NUM_INPUT}")
                        print(
                            f"Detected change in HomePen1num from empty to {data['HomePen1num']}. Sent command to play input 11.")

                    if self.previous_data["homepen2num"] == "" and data["homepen2num"] != "":
                        vmix_response = requests.get(
                            f"{VMIX_URL}?Function=QuickPlay&Input={HOMEPEN2NUM_INPUT}")
                        print(
                            f"Detected change in homepen2num from empty to {data['homepen2num']}. Sent command to play input 11.")

                    # Check penalties for the first change
                    if self.previous_data["awaypen1num"] == "" and data["awaypen1num"] != "":
                        vmix_response = requests.get(
                            f"{VMIX_URL}?Function=QuickPlay&Input={AWAYPEN1NUM_INPUT}")
                        print(
                            f"Detected change in awaypen1num from empty to {data['awaypen1num']}. Sent command to play input 11.")

                    if self.previous_data["awaypen2number"] == "" and data["awaypen2number"] != "":
                        vmix_response = requests.get(
                            f"{VMIX_URL}?Function=QuickPlay&Input={AWAYPEN2NUM_INPUT}")
                        print(
                            f"Detected change in awaypen2number from empty to {data['awaypen2number']}. Sent command to play input 11.")

                    # Check for homescore change and period
                    if data["homescore"] != self.previous_data["homescore"] and int(data["homescore"]) > int(self.previous_data["homescore"]):

                        self.send_vmix_commands_for_score_change(
                            current_period, "homescore")

                    # Check for awayscore change and period
                    if data["awayscore"] != self.previous_data["awayscore"] and int(data["awayscore"]) > int(self.previous_data["awayscore"]):
                        self.send_vmix_commands_for_score_change(
                            current_period, "awayscore")

                    # Update the previous data for scores and gameclock
                    self.previous_data.update({
                        "homescore": data["homescore"],
                        "awayscore": data["awayscore"],
                        "HomePen1num": data["HomePen1num"],
                        "homepen2num": data["homepen2num"],
                        "gameclock": data["gameclock"]
                        # "period" is already updated above
                    })
                    # we update the update timestamp
                    self.last_update_time = time.time()

            except requests.exceptions.RequestException as e:
                print(f"HTTP Request Error: {e}")
            except Exception as e:
                print(f"Error: {e}")

            # Wait for the specified interval before checking again
            time.sleep(CHECK_INTERVAL_SECONDS)
        print("Stopping Script")
