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

    def serial_thread(self):
        pass

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
        while not stop_event.is_set():
            if self.ser and self.ser.is_open:
                try:
                    data = self.ser.readline().decode('utf-8').strip()
                    if data:
                        EelUI.update_data(data)  # Send data to the UI
                        print("Received data:", data)  # Print data to the terminal
                except Exception as e:
                    print("Error reading serial data:", e)


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
    def connectDisconnect(selected_com_port, selected_baud_rate):
        # global serial_thread, serial_stop

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
        EelUI.showThirdPage()

    @staticmethod
    @eel.expose
    def showThirdPage():
        print("Showing the third page")
        eel.showThirdPage()

    @eel.expose
    def sendAcknowledgmentToMachine(ack_data):
        serial_communication.send_data(ack_data)

    # def reset_stopwatch():
        
    #     ack_data = "$M50;"

        # Send the reset command using serial_communication
        # serial_communication.send_data(ack_data)

        # Optionally, print a message
        # print(f"Sending acknowledgment command: {ack_data}")

if __name__ == "__main__":
    port_name = 'COM3'  # Replace 'COM1' with your serial port
    baud_rate = 115200  # Set your desired baud rate

    serial_communication = SerialCommunication()

    # Thread for reading from the serial port
    serial_thread = threading.Thread(target=serial_communication.read_serial)
    serial_thread.daemon = True

    EelUI.start_ui()