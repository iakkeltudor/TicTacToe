import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Systrace,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  getDocs,
  where,
  or,
  onSnapshot,
  deleteDoc,
  updateDoc,
  and,
} from "firebase/firestore";

import { login } from "./API/API";

const firebaseConfig = {
  apiKey: "AIzaSyBt8Yd5ZGhWu_5NeFmehvc9Xkx7KwRFY5k",
  authDomain: "xsi0-66c2a.firebaseapp.com",
  projectId: "xsi0-66c2a",
  storageBucket: "xsi0-66c2a.appspot.com",
  messagingSenderId: "1060579821950",
  appId: "1:1060579821950:web:f9220df65b6d3e296acb2f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class LoginScreen extends React.Component {
  state = {
    username: "",
    password: "",
    errorMessage: "",
  };

  handleLogin = () => {
    const { username, password } = this.state;

    if (username && password) {
      console.log("Username:", username);
      console.log("Password:", password);
    }

    let body = JSON.stringify({
      username: this.state.username,
      password: this.state.password,
    });
    console.log("body: " + body);
    login(body)
      .catch((error) => {
        console.log(error);
      })
      .then((result) => {
        console.log("result: " + result);
        const contentType = result.headers.get("Content-Type");
        console.log("contentType: " + contentType);
        if (contentType && contentType.indexOf("application/json") !== -1) {
          result.json().then((data) => {
            token = data.token;
            console.log("token: " + token);
            //this.props.setToken(result.token);
            //this.props.setUsername(this.state.fieldsValues.username);
            //return this.getUserFunction(navigation);
            this.props.navigation.navigate("Play", { username });
          });
        } else {
          console.log("aaaalooooo");
          Keyboard.dismiss();
          console.println(result);
          this.setState({ errorMessage: result });
        }
      });
  };

  render() {
    return (
      <ImageBackground
        source={require("./tic.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={styles.welcomeText}>Welcome to Tic-Tac-Toe!</Text>
          <Text>{"\n"}</Text>
          <Text>{"\n"}</Text>
          {this.state.message != "" && (
            <Text style={styles.errorMessage}>{this.state.message}</Text>
          )}
          <Text style={styles.fieldLabel}>Username:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            onChangeText={(text) => this.setState({ username: text })}
          />
          <Text style={styles.fieldLabel}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({ password: text })}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const { username, password } = this.state;
              console.log(this.state.username);
              this.handleLogin();
              //this.props.navigation.navigate("Play", { username });
            }}
            //onPress={() => this.props.navigation.navigate("Play", { username })}
          >
            <Text style={styles.buttonText}>Log-in</Text>
          </TouchableOpacity>
          <Text>{"\n"}</Text>
          <Text style={styles.createAccountText}>
            Is this your first time here? {"\n"}
            For full access to this app, you first need to create an account.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate("Registration")}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <Text>{"\n"}</Text>
          <Text style={styles.createAccountText}>
            Want to play a little game?
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate("TicTacToeSD")}
          >
            <Text style={styles.buttonText}>
              Play a short game on this device
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

class RegistrationScreen extends React.Component {
  state = {
    username: "",
    password: "",
    confirmPassword: "",
    message: "",
  };

  handleCreateAccount = () => {
    const { username, password, confirmPassword } = this.state;

    // Check for empty fields
    if (!username) {
      this.setState({ message: "Username empty" });
    } else if (!password) {
      this.setState({ message: "Password empty" });
    } else if (!confirmPassword) {
      this.setState({ message: "Confirm your password please" });
    } else if (password !== confirmPassword) {
      // Check for password mismatch
      this.setState({ message: "Passwords do not match. Please try again." });
    } else {
      // Perform account creation logic here

      // For demonstration purposes, let's just log the entered credentials
      console.log("Username:", username);
      console.log("Password:", password);

      this.props.navigation.navigate("Play", { username });
      // Set a success message
      this.setState({ message: "Account created successfully!" });
    }
  };

  render() {
    return (
      <ImageBackground
        source={require("./tic.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={styles.welcomeText}>Create an account</Text>

          <Text>{"\n"}</Text>

          <Text style={styles.fieldLabel}>Username:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            onChangeText={(text) => this.setState({ username: text })}
          />

          <Text style={styles.fieldLabel}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({ password: text })}
          />

          <Text style={styles.fieldLabel}>Confirm Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={this.handleCreateAccount}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          {this.state.message ? (
            <Text style={styles.errorMessage}>{this.state.message}</Text>
          ) : null}

          <Text>{"\n"}</Text>

          <Text style={styles.createAccountText}>
            Already have an account? {"\n"}
            Log in to access the app.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

class Play extends React.Component {
  renderMainPage = () => {
    const { route } = this.props;
    const { username } = route.params || {};
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {username || "Player"}!</Text>
        <Text style={styles.welcomeText}>Let's play!</Text>

        <Text>{"\n"}</Text>
        <Text>{"\n"}</Text>
        <Text>{"\n"}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.showInvites()}
        >
          <Text style={styles.buttonText}>See invites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.playWithBot()}
        >
          <Text style={styles.buttonText}>Play with Bot</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.challengeFriend()}
        >
          <Text style={styles.buttonText}>Challenge a Friend</Text>
        </TouchableOpacity>
      </View>
    );
  };

  challengeFriend = () => {
    const username = this.props.route.params.username;
    this.props.navigation.navigate("ChallengeAFriend", { username });
  };

  playWithBot = () => {
    // Handle logic for playing with a bot
    console.log("Playing with Bot");
  };

  showInvites = () => {
    const username = this.props.route.params.username;
    this.props.navigation.navigate("InvitesPage", { username });
  };

  render() {
    return (
      <ImageBackground
        source={require("./tic.png")}
        style={styles.backgroundImage}
      >
        {this.renderMainPage()}
      </ImageBackground>
    );
  }
}

class ChallengeAFriend extends React.Component {
  state = {
    friendUsername: "",
    username: this.props.route.params.username,
    message: "placeholder",
    showMessage: false,
    invited: false,
  };

  renderMainPage = () => {
    const { route } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>
          Your username: {this.state.username || "Player"}
        </Text>
        {!this.state.invited && (
          <Text style={styles.welcomeText}>Type in friend's username</Text>
        )}
        {!this.state.invited && (
          <TextInput
            style={styles.input}
            placeholder="Friend's username"
            onChangeText={(text) =>
              this.setState({
                friendUsername: text,
                message: "placeholder",
                showMessage: false,
              })
            }
          />
        )}

        {this.state.showMessage && (
          <Text style={styles.errorMessage}>{this.state.message}</Text>
        )}

        {!this.state.invited && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.challengeFriend()}
          >
            <Text style={styles.buttonText}>Challenge friend!</Text>
          </TouchableOpacity>
        )}
        {this.state.invited && (
          <Text style={styles.welcomeText}>
            Wait for {this.state.friendUsername} to accept
          </Text>
        )}
      </View>
    );
  };

  challengeFriend = async () => {
    alreadyExists = false;
    const querySnapshot = await getDocs(collection(db, "invites"));
    querySnapshot.forEach((doc) => {
      if (
        doc.data().challenger == this.props.route.params.username &&
        doc.data().challenged == this.state.friendUsername
      ) {
        alreadyExists = true;
      }
    });
    if (!alreadyExists) {
      const docRef = await addDoc(collection(db, "invites"), {
        challenger: this.props.route.params.username,
        challenged: this.state.friendUsername,
      });
      this.setState({ invited: true });
      console.log("Document written with ID: ", docRef.id);

      const q = query(
        collection(db, "games"),
        or(
          and(
            where("xplayer", "==", this.props.route.params.username),
            where("yplayer", "==", this.state.friendUsername)
          ),
          and(
            where("xplayer", "==", this.state.friendUsername),
            where("yplayer", "==", this.props.route.params.username)
          )
        )
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            console.log("Joc nou teso");
            unsubscribe();
            console.log("let s go incepe meciu");
            console.log(
              "!!!!!!!!@@@@@@@@@@@@@@@@@@@@ xplayer: " +
                change.doc.data().xplayer
            ),
              this.props.navigation.navigate("TicTacToe", {
                username: this.state.username,
                challenger: this.state.friendUsername,
                xplayer: change.doc.data().xplayer,
              });
          }
        });
      });
    } else {
      this.setState({ message: "Invite already exists!", showMessage: true });
    }
  };

  render() {
    return (
      <ImageBackground
        source={require("./tic.png")}
        style={styles.backgroundImage}
      >
        {this.renderMainPage()}
      </ImageBackground>
    );
  }
}

class InvitesPage extends React.Component {
  state = {
    username: this.props.route.params.username,
    challengers: [],
  };

  readInvites = async () => {
    const q = query(
      collection(db, "invites"),
      where("challenged", "==", this.state.username)
    );
    const challengers = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // Assuming doc.data().challenger is the field you want to use
      const challenger = doc.data().challenger;
      console.log("Challenger: " + challenger);
      challengers.push(challenger);
    });

    this.setState({ challengers });
  };

  acceptInvite = async (challenger) => {
    x = Math.floor(Math.random() * 2);
    if (x == 0) {
      player1 = this.props.route.params.username;
      player2 = challenger;
    } else {
      player1 = challenger;
      player2 = this.props.route.params.username;
    }
    const docRef = await addDoc(collection(db, "games"), {
      xplayer: player1,
      yplayer: player2,
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
    });
    console.log("Document written with ID: ", docRef.id);
    console.log("Mergem pe pagina de joc");

    const q = query(
      collection(db, "invites"),
      where("challenger", "==", challenger),
      where("challenged", "==", this.state.username)
    );

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        // Delete the document
        const documentRef = doc.ref;
        deleteDoc(documentRef)
          .then(() => {
            console.log("Invite successfully deleted");
          })
          .catch((error) => {
            console.error("Error deleting invite: ", error);
          });
      });
    } catch (error) {
      console.error("Error getting invites: ", error);
    }

    this.props.navigation.navigate("TicTacToe", {
      username: this.state.username,
      challenger: challenger,
      xplayer: player1,
    });
  };

  componentDidMount() {
    this.readInvites(); // Call readInvites when the component mounts
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        style={{ flex: 1 }}
      >
        <View>
          {this.state.challengers.map((challenger, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => this.acceptInvite(challenger)}
              style={styles.inviteButton}
            >
              <Text style={styles.inviteButtonText}>{challenger}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }
}

class TicTacToe extends React.Component {
  state = {
    grid: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    player1Name: this.props.route.params.username,
    player2Name: this.props.route.params.challenger,
    scores: {
      player1: 0,
      player2: 0,
    },
    myTurn: false,
    xplayer: this.props.route.params.xplayer,
  };

  handleCellPress = async (row, col) => {
    const { grid, currentPlayer, scores } = this.state;

    // Check if the cell is empty before making a move
    if (grid[row][col] === 0) {
      const newGrid = [...grid];
      newGrid[row][col] = this.state.xplayer == this.state.player1Name ? 1 : 2;

      // Switch players for the next move
      this.setState({
        grid: newGrid,
      });

      const q = query(
        collection(db, "games"),
        where("xplayer", "==", this.props.route.params.xplayer),
        where(
          "yplayer",
          "==",
          this.props.route.params.xplayer == this.state.player1Name
            ? this.state.player2Name
            : this.state.player1Name
        )
      );

      try {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const documentRef = doc.ref;
          updateDoc(documentRef, {
            [String(3 * row + col)]: grid[row][col],
          });
          console.log("Updated document");
        });
      } catch (error) {
        console.error("Error getting invites: ", error);
      }
      if (this.checkWinner(newGrid) == 1) {
        scores.player1++;
        this.setState({
          scores: scores,
          grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
        });
      } else if (this.checkWinner(newGrid) == 0) {
        scores.player2++;
        this.setState({
          scores: scores,
          grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
        });
      } else if (this.checkWinner(newGrid) == 2) {
        this.setState({
          grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
        });
        console.log("Draw");
      }

      // Update the scores if there is a winner (you need to implement the logic for checking the winner)
      // For now, just increment the score for the current player
      // const winner = this.checkWinner(newGrid);
      // if (winner === 1) {
      //   this.setState({
      //     scores: { ...scores, player1: scores.player1 + 1 },
      //   });
      // } else if (winner === 2) {
      //   this.setState({
      //     scores: { ...scores, player2: scores.player2 + 1 },
      //   });
      // }

      // // Print the updated grid in the console
      // console.log("Updated Grid:", newGrid);
    }
  };

  componentDidMount() {
    const { xplayer, player1Name } = this.state;
    console.log("xplayer: " + xplayer);
    console.log("player1Name: " + player1Name);
    if (xplayer == player1Name) {
      this.setState({ myTurn: true });
    } else {
      this.setState({ myTurn: false });
    }

    ///aiici undeva este oroblemaaa~!~~~~~~~!!!!!!!!!!!!!!!!!!!!!!!
    console.log("player1Name: " + player1Name);
    console.log("xplayer: " + xplayer);
    console.log("player2Name: " + this.state.player2Name);

    const q = query(
      collection(db, "games"),
      or(
        where("xplayer", "==", xplayer),
        where(
          "yplayer",
          "==",
          xplayer == player1Name ? this.state.player2Name : player1Name
        )
      )
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          console.log("un document este modificat teso");
          if (this.state.myTurn == false) {
            console.log("S a modificat un patratel teso");
            //update grid, read it from database
            newGrid = [
              [
                change.doc.data()["0"],
                change.doc.data()["1"],
                change.doc.data()["2"],
              ],
              [
                change.doc.data()["3"],
                change.doc.data()["4"],
                change.doc.data()["5"],
              ],
              [
                change.doc.data()["6"],
                change.doc.data()["7"],
                change.doc.data()["8"],
              ],
            ];
            console.log("newGrid: " + newGrid);

            if (this.checkWinner(newGrid) == 1) {
              console.log("@@@@@@@@@@@@@2");
              this.setState({
                scores: {
                  ...this.state.scores,
                  player1: this.state.scores.player1 + 1,
                },
              });
              newGrid = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
              ];
            } else if (this.checkWinner(newGrid) == 0) {
              console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!");
              this.setState({
                scores: {
                  ...this.state.scores,
                  player2: this.state.scores.player2 + 1,
                },
              });
              newGrid = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
              ];
            } else if (this.checkWinner(newGrid) == 2) {
              newGrid = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
              ];
            }

            this.setState({ grid: newGrid });
            this.setState({ myTurn: true });
          } else {
            this.setState({ myTurn: false });
          }
        }
      });
    });
  }

  checkWinner = (grid) => {
    for (let i = 0; i < 3; i++) {
      if (
        grid[i][0] !== 0 &&
        grid[i][0] === grid[i][1] &&
        grid[i][0] === grid[i][2]
      ) {
        return (
          grid[i][0] == (this.state.xplayer == this.state.player1Name ? 1 : 2)
        ); // Winner found in the row
      }

      if (
        grid[0][i] !== 0 &&
        grid[0][i] === grid[1][i] &&
        grid[0][i] === grid[2][i]
      ) {
        return (
          grid[0][i] == (this.state.xplayer == this.state.player1Name ? 1 : 2)
        ); // Winner found in the column
      }
    }

    // Check diagonals
    if (
      grid[0][0] !== 0 &&
      grid[0][0] === grid[1][1] &&
      grid[0][0] === grid[2][2]
    ) {
      return (
        grid[0][0] == (this.state.xplayer == this.state.player1Name ? 1 : 2)
      ); // Winner found in the main diagonal
    }

    if (
      grid[0][2] !== 0 &&
      grid[0][2] === grid[1][1] &&
      grid[0][2] === grid[2][0]
    ) {
      return (
        grid[0][2] == (this.state.xplayer == this.state.player1Name ? 1 : 2)
      ); // Winner found in the other diagonal
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i][j] == 0) return 3;
      }
    }
    return 2; // No winner found
  };

  renderMainPage = () => {
    const { grid, scores, player1Name, player2Name } = this.state;

    return (
      <View style={styles.container}>
        <Text>{this.state.myTurn ? "Your turn" : "Oponent's turn"}</Text>
        <View style={styles.playerNameContainer}>
          <Text style={styles.playerName}>{player1Name}</Text>
          <Text style={styles.playerName}> </Text>
          <Text style={styles.playerName}>{player2Name}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{scores.player1}</Text>
          <Text style={styles.scoreText}> : </Text>
          <Text style={styles.scoreText}>{scores.player2}</Text>
        </View>

        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.cell}
                onPress={() => this.handleCellPress(rowIndex, colIndex)}
                disabled={!this.state.myTurn}
              >
                <Text style={styles.cellText}>
                  {cell === 1 ? "X" : cell === 2 ? "O" : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  render() {
    return (
      <ImageBackground
        source={require("./tic.png")}
        style={styles.backgroundImage}
      >
        {this.renderMainPage()}
      </ImageBackground>
    );
  }
}

class TicTacToeSD extends React.Component {
  state = {
    grid: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    currentPlayer: 1, // 1 corresponds to 'X', 2 corresponds to 'O'
    player1Name: "Player1",
    player2Name: "Player2",
    scores: {
      player1: 0,
      player2: 0,
    },
    showStartingPlayer: true,
  };

  handleCellPress = (row, col) => {
    const { grid, currentPlayer, scores } = this.state;

    if (this.state.showStartingPlayer) {
      this.hideStartingPlayerMessage();
    }
    // Check if the cell is empty before making a move
    if (grid[row][col] === 0) {
      const newGrid = [...grid];
      newGrid[row][col] = currentPlayer;

      // Check for a winner
      const winner = this.checkWinner(newGrid);

      // Check for a draw
      const isDraw = newGrid.every((row) => row.every((cell) => cell !== 0));

      // If there is a winner or a draw, reset the game for the next round
      if (winner === 1 || winner === 2 || isDraw) {
        this.setState({
          grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
          currentPlayer: isDraw ? currentPlayer : winner === 1 ? 2 : 1,
          scores: {
            player1: isDraw
              ? scores.player1
              : winner === 1
              ? scores.player1 + 1
              : scores.player1,
            player2: isDraw
              ? scores.player2
              : winner === 2
              ? scores.player2 + 1
              : scores.player2,
          },
          showStartingPlayer: true,
        });
      } else {
        // Switch players for the next move if there is no winner or draw
        this.setState({
          grid: newGrid,
          currentPlayer: currentPlayer === 1 ? 2 : 1,
        });
      }

      // Print the updated grid in the console
      console.log("Updated Grid:", newGrid);
    }
  };

  checkWinner = (grid) => {
    // Check rows and columns
    for (let i = 0; i < 3; i++) {
      if (
        grid[i][0] !== 0 &&
        grid[i][0] === grid[i][1] &&
        grid[i][0] === grid[i][2]
      ) {
        return grid[i][0]; // Winner found in the row
      }

      if (
        grid[0][i] !== 0 &&
        grid[0][i] === grid[1][i] &&
        grid[0][i] === grid[2][i]
      ) {
        return grid[0][i]; // Winner found in the column
      }
    }

    // Check diagonals
    if (
      grid[0][0] !== 0 &&
      grid[0][0] === grid[1][1] &&
      grid[0][0] === grid[2][2]
    ) {
      return grid[0][0]; // Winner found in the main diagonal
    }

    if (
      grid[0][2] !== 0 &&
      grid[0][2] === grid[1][1] &&
      grid[0][2] === grid[2][0]
    ) {
      return grid[0][2]; // Winner found in the other diagonal
    }

    return 0; // No winner found
  };

  renderMainPage = () => {
    const {
      grid,
      scores,
      player1Name,
      player2Name,
      currentPlayer,
      showStartingPlayer,
    } = this.state;

    return (
      <View style={styles.container}>
        {showStartingPlayer && (
          <Text style={styles.startingPlayerText}>
            {`Starting player: ${currentPlayer === 1 ? "X" : "O"}`}
          </Text>
        )}
        <View style={styles.playerNameContainer}>
          <Text style={styles.playerName}>{player1Name}</Text>
          <Text style={styles.playerName}> vs </Text>
          <Text style={styles.playerName}>{player2Name}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{scores.player1}</Text>
          <Text style={styles.scoreText}> : </Text>
          <Text style={styles.scoreText}>{scores.player2}</Text>
        </View>

        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.cell}
                onPress={() => this.handleCellPress(rowIndex, colIndex)}
              >
                <Text style={styles.cellText}>
                  {cell === 1 ? "X" : cell === 2 ? "O" : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  // Add this method to hide the starting player message after the initial rendering
  hideStartingPlayerMessage = () => {
    this.setState({ showStartingPlayer: false });
  };

  render() {
    return (
      <ImageBackground
        source={require("./tic.png")}
        style={styles.backgroundImage}
      >
        {this.renderMainPage()}
      </ImageBackground>
    );
  }
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Play" component={Play} />
        <Stack.Screen name="ChallengeAFriend" component={ChallengeAFriend} />
        <Stack.Screen name="InvitesPage" component={InvitesPage} />
        <Stack.Screen name="TicTacToe" component={TicTacToe} />
        <Stack.Screen name="TicTacToeSD" component={TicTacToeSD} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
    color: "black", // Change this color to your desired color
  },
  fieldLabel: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 2,
    color: "black", // Change this color to your desired text color
  },
  input: {
    height: 40,
    borderColor: "gray", // Change this color to your desired text color
    borderBottomWidth: 1, // Add this line to display only the bottom line
    paddingLeft: 10,
    marginBottom: 6,
    width: "60%",
    color: "black", // Change this color to your desired text color
  },
  button: {
    backgroundColor: "black", // Change this color to your desired color
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white", // Change this color to your desired text color
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red", // Change this color to your desired text color
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
  },
  inviteButton: {
    backgroundColor: "lightblue",
    width: 200, // Adjusted width for better readability
    padding: 15,
    margin: 10,
    borderRadius: 10, // Rounded borders
    borderWidth: 3,
    borderColor: "black", // Black border color
  },
  inviteButtonText: {
    fontSize: 18, // Increased font size
    textAlign: "center",
  },
  createAccountText: {
    textAlign: "center",
    color: "gray", // Change this color to your desired text color
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    margin: 5,
  },
  cellText: {
    fontSize: 40,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 70,
    fontWeight: "bold",
    color: "black",
  },
  playerNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  playerName: {
    fontSize: 25,
    color: "black",
  },
  startingPlayerText: {
    fontSize: 15,
    color: "black",
  },
});
