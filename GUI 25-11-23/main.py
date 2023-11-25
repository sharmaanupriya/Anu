import eel
import serial
import serial.tools.list_ports
import threading

# Initialize Eel
eel.init('web')

class SerialCommunication:
    def __init__(self):
        self.port_name = ""
        self.baud_rate = ""
        self.ser = None
        self.is_connected = False
        self.stop_event = threading.Event()     # Event for stopping the thread

        self.home_cmd = ["$G28;", "$EZ11;", "$EZ10;"]
        self.home_cmd_idx = 0

    def serial_thread(self):
        pass

    def excute_cmd_seq(self, data, cmd_seq, cmd_idx, cmd_exc):
        cmd_len = len(cmd_seq) - 1
        done = False

        if data == str(cmd_seq[cmd_idx]):
            if data == str(cmd_seq[cmd_idx]):
                print(f"r : {cmd_idx}")

                if data == cmd_exc:
                    done = True
                
                cmd_idx = cmd_idx + 1

                if cmd_idx > cmd_len:                    
                    cmd_idx = 0

        else:
            cmd_idx = 0

        return cmd_idx, done

    def init_serial(self):
        if not self.ser:
            self.ser = serial.Serial()

    def get_com_port(self):
        ports = serial.tools.list_ports.comports()
        self.com_list = [com[0] for com in ports]
        print(self.com_list)
        return self.com_list

    def open_serial(self, port_name, baud_rate):
        self.port_name = port_name
        self.baud_rate = baud_rate

        self.init_serial()

        try:
            if self.ser.is_open:
                self.ser.close()

            self.ser.baudrate = self.baud_rate
            self.ser.port = self.port_name
            self.ser.timeout = 0.1
            self.ser.open()
            self.is_connected = True
            print(f"Serial Open : Success, COM Port: {self.port_name}, Baud Rate: {self.baud_rate}")

        except Exception as e:
            print("Serial Open : Fail")
            print(e)
            self.is_connected = False

    def close_serial(self):
        if self.ser and self.ser.is_open:
            try:
                self.ser.close()
            except Exception as e:
                print("Error closing serial port:", e)
            finally:
                self.is_connected = False


    def read_serial(self, stop_event):
        received_data = ""  # Variable to accumulate received data
        required_ack_strings = ["$G28;", "$EZ11;", "$EZ10;"]
        sequence_state = 0  # 0: Waiting for "$G28;", 1: Waiting for "$EZ11;", 2: Waiting for "$EZ10;"

        while not stop_event.is_set():
            if self.ser and self.ser.is_open:
                try:
                    data = self.ser.readline().decode('utf-8').strip()
                    if data:
                        EelUI.update_data(data)  # Send data to the UI
                        print("Received data:", data)  # Print data to the terminal

                        self.home_cmd_idx, cmd_done = self.excute_cmd_seq(data, self.home_cmd, self.home_cmd_idx, "$EZ10;")

                        if cmd_done == True:
                            cmd_done = False
                            print("Execute Cmd")
                            self.showThirdPage()

                        # if data == required_ack_strings[sequence_state]:
                        #     if sequence_state == 0:
                        #         print("Home")
                        #     elif sequence_state == 1:
                        #         print("Limit switch press")
                        #     elif sequence_state == 2:
                        #         print("Limit switch released")

                        #     sequence_state += 1

                        #     if sequence_state == len(required_ack_strings):
                        #         print("Received entire sequence. Go to page3")
                        #         self.showThirdPage()
                        #         sequence_state = 0  # Reset the sequence state

                except Exception as e:
                    print(f"Error reading serial data: {e}")

    def showThirdPage(self):
        # Implement the logic to switch to the third page in your GUI here
        # This is just a placeholder. Replace it with your actual logic.
        eel.showThirdPage()
        print("Showing the third page")


    def send_data(self, data):
        if self.ser and self.ser.is_open:
            self.ser.write(data.encode())

class EelUI:
    @staticmethod
    def start_ui():
        # Start the Eel application
        eel.start('index.html', size=(900, 700))

    @staticmethod
    @eel.expose
    def send_ack(ack_data):
        serial_communication.send_data(ack_data)

    @staticmethod
    @eel.expose
    def update_data(data):
        eel.update_data(data)

    @staticmethod
    @eel.expose
    def connectDisconnect(selected_com_port, selected_baud_rate, buttonName):
        # global serial_thread, serial_stop

        print("Btn :", buttonName)

        if serial_communication.is_connected:
            # Disconnect logic
            print("Disconnect")
            serial_communication.close_serial()
            serial_communication.set()  # Signal the thread to stop
            serial_thread.join()  # Wait for the thread to finish

        # Connect logic
        print("Connect")
        serial_communication.open_serial(selected_com_port, selected_baud_rate)

        # Create a new thread for reading from the serial port
        serial_stop = threading.Event()
        serial_thread = threading.Thread(target=serial_communication.read_serial, args=(serial_stop,))
        serial_thread.daemon = True
        serial_thread.start()


    @staticmethod
    @eel.expose
    def refreshCOMPorts():
        com_ports = serial_communication.get_com_port()
        print("Refresh successful")
        EelUI.updateCOMPorts(com_ports)

    @staticmethod
    @eel.expose
    def updateCOMPorts(com_ports):
        eel.updateCOMPorts(com_ports)

    @staticmethod
    @eel.expose
    def goHome(selected_com_port, selected_baud_rate):
        EelUI.send_ack('$G28;')

    @eel.expose
    def sendAcknowledgmentToMachine(seconds):
        acknowledgmentCommand = f"$M30 S{seconds};"
        EelUI.send_ack(acknowledgmentCommand)

    @eel.expose
    def sendAcknowledgment():
        reset_command = "$M50;"
        EelUI.send_ack(reset_command)

    # @staticmethod
    # @eel.expose
    # def sendAcknowledgment(ack_data):
    #     serial_communication.send_data(ack_data)



if __name__ == "__main__":
    port_name = 'COM3'  # Replace 'COM1' with your serial port
    baud_rate = 115200  # Set your desired baud rate

    serial_communication = SerialCommunication()

    # Thread for reading from the serial port
    serial_thread = threading.Thread(target=serial_communication.read_serial)
    serial_thread.daemon = True

    EelUI.start_ui()