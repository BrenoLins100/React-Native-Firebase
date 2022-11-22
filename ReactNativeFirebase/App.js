import React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import uuid from "react-native-uuid";
import Feather from "react-native-vector-icons/Feather";

//Database
import { db } from "./Core/Config";

import { set, ref, onValue, remove, update } from "firebase/database";

import AppLoading from "expo-app-loading";

import {useFonts} from 'expo-font'

export default function App() {

  const [loaded] = useFonts({
    adineuePRORegular: require('./assets/fonts/adineuePRORegular.ttf'),
    adineuePROLight: require('./assets/fonts/adineuePROLight.ttf'),
    adineuePROBold: require('./assets/fonts/adineuePROBold.ttf'),
    adineueTEXTLight: require('./assets/fonts/adineueTEXTLight.ttf'),
    adineueTEXTBold: require('./assets/fonts/adineueTEXTBold.ttf')
  })

  
  const [dados, setDados] = useState([]);
  const [nome, setNome] = useState("");
  const [rep, setRep] = useState("");
  const finalizado = false;

  const [valorId, setValorId] = useState("");

  const [editando, setEditando] = useState(false);

  //contando registros
  const [registros,setRegistros] = useState(0);

  const id = uuid.v4();
  const dataHoje = new Date();
  const diaHoje =
    dataHoje.getDate() +
    "/" +
    (dataHoje.getMonth() + 1) +
    "/" +
    dataHoje.getFullYear();
  const horarioHoje =
    dataHoje.getHours() +
    ":" +
    dataHoje.getMinutes() +
    ":" +
    dataHoje.getSeconds();

  const Criar = () => {
    //console.log("criadoEm:"+dataEx.getHours())

    set(ref(db, `/${id}`), {
      nome,
      rep,
      diaHoje,
      horarioHoje,
      finalizado,
      id,
    });

    setNome("");
    setRep("");
  };

  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      setDados([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((item) => {
          setDados((oldArray) => [...oldArray, item]);
        });
        setRegistros(Object.keys(data).length)
      }
      
    });
  }, []);

  const Atualizar = (item) => {
    setEditando(true);
    setValorId(item.id);
    setNome(item.nome);
    setRep(item.rep);
  };

  const Confirmar = () => {
    update(ref(db, `/${valorId}`), {
      nome,
      rep,
      id: valorId,
    });

    setNome("");
    setRep("");
    setEditando(false);
  };

  const Finalizar = (item) => {
    var status = false;

    item.finalizado == false ? (status = true) : (status = false);

    update(ref(db, `/${item.id}`), {
      nome: item.nome,
      rep: item.rep,
      diaHoje: item.diaHoje,
      horarioHoje: item.horarioHoje,
      finalizado: status,
      id: item.id,
    });
  };

  const Deletar = (item) => {
    return Alert.alert(
      "Você tem certeza ?",
      "Deseja deletar este item?",

      [
        //sim

        {
          text: "Sim",

          onPress: () => {
            remove(ref(db, `/${item.id}`));
          },
        },

        //nao

        {
          text: "Não",
        },
      ]
    );
  };

  if (!loaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.textoPrincipal}>Gerenciador de treinos</Text>

        <View style={styles.painel}>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.inputTexto}
              placeholder="Nome:"
              onChangeText={(nome) => {
                setNome(nome);
              }}
              value={nome}
            ></TextInput>
            <TextInput
              style={styles.inputTexto}
              placeholder="Repetições:"
              onChangeText={(rep) => {
                setRep(rep);
              }}
              value={rep}
            ></TextInput>

            {editando ? (
              <>
                <TouchableOpacity style={styles.btnCad}>
                  <Feather
                    onPress={Confirmar}
                    name="check-square"
                    size={25}
                    color="#fff"
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.btnCad} onPress={Criar}>
                  <Feather name="file-plus" size={25} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text style={[styles.registros, dados.length == 0 ? {display: 'none'} : {display: 'flex'}  ]} >Total de registros: {registros}</Text>
          <Text style={[styles.registros, dados.length == 0 ? {display: 'flex'} : {display: 'none'}  ]} >Nenhum registro encontrado.</Text>
          <FlatList
            vertical={true}
            showsVerticalScrollIndicator={false}
            data={dados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => 
            (

              <View
                key={item.id}
                style={[
                  styles.dadosUsu,

                  item.finalizado == false
                    ? { borderLeftColor: "#c0392b" }
                    : { borderLeftColor: "#3ae374" },
                  
                ]}
              >
                <View style={styles.infos}>
                  <Feather name="flag" size={17.5} color="#1abc9c" />
                  <Text
                    style={[
                      styles.valorDado,
                      item.finalizado == false
                        ? {  }
                        : { textDecorationLine: "line-through" },
                    ]}
                  >
                    Nome: {item.nome}
                  </Text>
                </View>

                <View style={styles.infos}>
                  <Feather name="repeat" size={17.5} color="#2ecc71" />
                  <Text
                    style={[
                      styles.valorDado,
                      item.finalizado == false
                        ? {  }
                        : { textDecorationLine: "line-through" },
                    ]}
                  >
                    Repetições: {item.rep}
                  </Text>
                </View>

                <View style={styles.infos}>
                  <Feather name="calendar" size={17.5} color="#3498db" />
                  <Text
                    style={[
                      styles.valorDado,
                      item.finalizado == false
                        ? {  }
                        : { textDecorationLine: "line-through" },
                    ]}
                  >
                    Data: {item.diaHoje}
                  </Text>
                </View>

                <View style={styles.infos}>
                  <Feather name="clock" size={17.5} color="#9b59b6" />
                  <Text
                    style={[
                      styles.valorDado,
                      item.finalizado == false
                        ? { }
                        : { textDecorationLine: "line-through" },
                    ]}
                  >
                    Hora: {item.horarioHoje}
                  </Text>
                </View>

                <Text
                  style={[styles.valorDado, { display: "none" }]}
                  key={item.id}
                >
                  Id: {item.id}
                </Text>

                <View style={[styles.icones, editando ? {opacity: 0} : {opacity: 1}]}>
                  {item.finalizado ? (
                    <>
                      <Feather
                        onPress={() => {
                          Finalizar(item);
                        }}
                        name="corner-down-left"
                        size={25}
                        color="#c0392b"
                        disabled={editando ? true : false}
                      />
                    </>
                  ) : (
                    <>
                      <Feather
                        onPress={() => {
                          Finalizar(item);
                        }}
                        name="check-circle"
                        size={25}
                        color="#3ae374"
                        disabled={editando ? true : false}
                      />
                    </>
                  )}

                  <Feather
                    onPress={() => {
                      Atualizar(item);
                    }}
                    name="edit-2"
                    size={25}
                    color="#3498db"
                  />
                  <Feather
                    onPress={() => {
                      Deletar(item);
                    }}
                    name="trash"
                    size={25}
                    color="#c0392b"
                    disabled={editando ? true : false}
                  />
                </View>
              </View>

            )}


          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1abc9c",
  },
  textoPrincipal: {
    fontSize: 27,
    textAlign: "center",
    marginTop: 30,
    padding: 30,
    color: "#FFF",
    fontFamily: "adineuePRORegular",
    textTransform: "uppercase",
  },
  painel: {
    backgroundColor: "#fff",
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: "column",
    flex: 1,
  },
  dadosUsu: {
    marginTop: 10,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderLeftWidth: 5,
    padding: 15,
    backgroundColor: "#e3e5fa", //#c5f0ed #cadde3
  },
  valorDado: {
    fontSize: 15,
    fontFamily: "adineuePRORegular",
    paddingTop: 5,
    paddingLeft: 5,
    paddingBottom: 5,
    textTransform: "uppercase"
  },
  inputTexto: {
    width: 90,
    padding: 10,
    borderWidth: 3,
    borderColor: "#1abc9c",
    borderRadius: 3,
    flex: 4,
    marginRight: 10,
    fontFamily: "adineuePRORegular",
  },
  registros: {
    fontFamily: "adineuePRORegular",
    textTransform: "uppercase",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 3,
    color: "#fff"
  },
  btnCad: {
    backgroundColor: "#1abc9c",
    alignItems: "center",
    justifyContent: "center",
    flex: 3,
    borderRadius: 3,
  },
  icones: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  infos: {
    flexDirection: "row",
    alignItems: "center",
  },
});
