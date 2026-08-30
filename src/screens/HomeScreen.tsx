import { useState } from "react";
import TopBar from "../components/TopBar";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal, //para mostrar modal
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { generateNumber } from "../services/NumberGeneratorService"; //importar archivo para logica de numeros

export default function HomeScreen() {
  const [currentNumber, setCurrentNumber] = useState("00"); //numero en pantalla
  const [history, setHistory] = useState<string[]>([]); //historial
  
  const [maxNumber, setMaxNumber] = useState("90"); // bnt configuracion
  const [allowRepeats, setAllowRepeats] = useState(true); // bnt configuracion
  const [fullHistory, setFullHistory] = useState<string[]>([]); // historial completo
  const [isDrawing, setIsDrawing] = useState(false); // tombola

  const [showHistoryModal, setShowHistoryModal] = useState(false); // historial completo modal
  const [showSettings, setShowSettings] = useState(false); // bnt configuracion
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveSettingsModal, setShowSaveSettingsModal] = useState(false);
  
  //pendiente dark mode

  // resetear partida
  const resetGame = () => {
    setCurrentNumber("00");
    setHistory([]);
    setFullHistory([]);
  };

  const handleSpin = () => {

    if (isDrawing) return;

    setIsDrawing(true);

    let counter = 0;

    const config = {
      maxNumber: Number(maxNumber),
      allowRepeats,
    };

    const interval = setInterval(() => {

      const tempNumber = generateNumber(config,[]);

      setCurrentNumber(
        tempNumber.toString().padStart(2, "0")
      );

      counter++;

      if (counter >= 20) {

        clearInterval(interval);

        const finalNumber = generateNumber(config,fullHistory);

        if (finalNumber === -1) {
          clearInterval(interval);

          setIsDrawing(false);

          setShowGameOverModal(true);

          return;
        }

        const formattedNumber =
          finalNumber.toString().padStart(2, "0");

        setCurrentNumber(formattedNumber);

        setHistory((previousHistory) => {

          const newHistory = [
            formattedNumber,
            ...previousHistory,
          ];

          return newHistory.slice(0, 4);

        });

        setFullHistory((previousHistory) => [
          ...previousHistory,
          formattedNumber,
        ]);

        setIsDrawing(false);
      }

    }, 15);
  };

  
  return (
    <View style={styles.container}>

      <TopBar

          onSettingsPress={() => setShowSettings(true)}

          onHistoryPress={() => setShowHistoryModal(true)}

          onResetPress={() => setShowResetModal(true)}

      />
      

      {/* <Text style={styles.title}>
        BINGO CLICK
      </Text> */}

      <Text style={styles.number}>
        {currentNumber}
      </Text>

      <TouchableOpacity style={[styles.button,isDrawing && { opacity: 0.5 } ]} onPress={handleSpin} disabled={isDrawing}>
        <Text style={styles.buttonText}>
          GIRAR
        </Text>
      </TouchableOpacity>

      {/* Historial */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>
          Últimos números
        </Text>

        <View style={styles.historyList}>
          {history.map((number, index) => (
            <View
              key={`${number}-${index}`}
              style={styles.historyBubble}
            >
              <Text style={styles.historyText}>
                {number}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {/* Fin Historial */}

      {/* Historial completo */}
      {/* <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setShowHistoryModal(true)}
      >
        <Text style={styles.settingsText}>
          📜 Historial Completo
        </Text>
      </TouchableOpacity> */}
      {/* Fin Historial completo */}


      {/* Configuracion */}
      {/* <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setShowSettings(true)}
      >
        <Text style={styles.settingsText}>
          ⚙️ Configuración
        </Text>
      </TouchableOpacity> */}

      {/* Reiniciar partida */}
      {/* <TouchableOpacity
        style={styles.resetButton}
        onPress={() => setShowResetModal(true)}
      >
        <Text style={styles.buttonText}>
          Reiniciar partida
        </Text>
      </TouchableOpacity> */}
      {/* Fin Reiniciar partida */}
      
      {/* Modal configuracion */}
      <Modal
        visible={showSettings}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              Configuración
            </Text>

            <Text style={styles.label}>
              Número máximo
            </Text>

            <TextInput
              value={maxNumber}
              onChangeText={setMaxNumber}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.label}>
              Permitir números repetidos
            </Text>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() =>
                setAllowRepeats(!allowRepeats)
              }
            >
              <Text style={styles.buttonText}>
                {allowRepeats ? "Sí" : "No"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSaveSettingsModal(true)}
            >
              <Text style={styles.buttonText}>
                Guardar configuración
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      {/* Fin Modal configuracion */}

      {/* Modal historial completo */}
      <Modal
        visible={showHistoryModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              Historial de la partida
            </Text>

            <ScrollView
              style={styles.historyScroll}
              showsVerticalScrollIndicator={false}
            >
              {fullHistory.map((number, index) => (
                <Text
                  key={`${number}-${index}`}
                  style={styles.historyItem}
                >
                  {index + 1}. {number}
                </Text>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowHistoryModal(false)}
            >
              <Text style={styles.buttonText}>
                Cerrar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      {/* Fin Modal historial completo */}

      {/* Modal de no quedan mas numeros */}
      <Modal visible={showGameOverModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              🎉 Fin de partida
            </Text>

            <Text style={styles.gameOverText}>
              Ya no quedan números disponibles.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                resetGame();
                setShowGameOverModal(false);
              }}
            >
              <Text style={styles.buttonText}>
                Reiniciar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                setShowGameOverModal(false)
              }
            >
              <Text style={styles.buttonText}>
                Cerrar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      {/* Fin Modal de no quedan mas numeros */}


      {/* MODAL DE REINICIO DE PARTIDA */}
      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              Reiniciar partida
            </Text>

            <Text style={styles.modalMessage}>
              ¿Estás seguro de que deseas reiniciar la partida?
            </Text>

            <Text style={styles.modalSubMessage}>
              La configuración que elegiste se mantendrá para la siguiente partida.
            </Text>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                resetGame();
                setShowResetModal(false);
              }}
            >
              <Text style={styles.buttonText}>
                Reiniciar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowResetModal(false)}
            >
              <Text style={styles.buttonText}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      {/* FIN MODAL DE REINICIO DE PARTIDA */}

      {/* MODAL PARA CONFIRMAR CONFIGURACION */}
      <Modal
        visible={showSaveSettingsModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              Aplicar configuración
            </Text>

            <Text style={styles.modalMessage}>
              ¿Deseas guardar la nueva configuración?
            </Text>

            <Text style={styles.modalSubMessage}>
              La partida actual se reiniciará para aplicar los cambios.
            </Text>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {

                resetGame();

                setShowSaveSettingsModal(false);

                setShowSettings(false);

              }}
            >
              <Text style={styles.buttonText}>
                Aplicar cambios
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowSaveSettingsModal(false)}
            >
              <Text style={styles.buttonText}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      {/* FIN MODAL PARA CONFIRMAR CONFIGURACION */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },

  number: {
    color: "white",
    fontSize: 100,
    fontWeight: "bold",
    marginBottom: 40,
  },

  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  historyContainer: {
  marginTop: 40,
  alignItems: "center",
  },

  historyTitle: {
    color: "white",
    marginBottom: 15,
    fontSize: 18,
    fontWeight: "bold",
  },

  historyList: {
    flexDirection: "row",
    gap: 10,
  },

  historyBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD700",
  },

  historyText: {
    color: "white",
    fontWeight: "bold",
  },
  settingsButton: {
  marginTop: 20,
  },

  settingsText: {
    color: "#FFD700",
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  modalContent: {
    width: "95%",
    maxHeight: "80%",
    backgroundColor: "#222",
    padding: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    color: "white",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#333",
    color: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },

  toggleButton: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  closeButton: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 10,
  },
  resetButton: {
    marginTop: 10,
    backgroundColor: "#8B0000",
    padding: 12,
    borderRadius: 10,
  },
  historyItem: {
    color: "white",
    marginBottom: 8,
  },
  gameOverText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalMessage: {
    color: "white",
    fontSize: 17,
    textAlign: "center",
    marginBottom: 10,
  },

  modalSubMessage: {
    color: "#B0B0B0",
    textAlign: "center",
    marginBottom: 25,
  },

  confirmButton: {
    backgroundColor: "#D32F2F",
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,alignItems: "center",
  justifyContent: "center",
  },

  cancelButton: {
    backgroundColor: "#555",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  justifyContent: "center",
  },
  historyScroll: {
    maxHeight: "70%",
    marginBottom: 20,
  },
});