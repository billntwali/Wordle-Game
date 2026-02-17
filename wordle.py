
import random
from colorama import Back, Style, init
def load_words(file):
    #This function will be used to load the list of valid Wordle words from wordle.txt into our game and return a list of 5-letter words
    with open(file, "r") as f:
        words = [line.strip().lower() for line in f]
    return words
    
def choose_secretword(word_list): 
    # Now this function will select a random secret word from the list of words 
    return random.choice(word_list)

def get_validguess(word_list):
    #This function will ask the user for a guess and check it by checking if it is exactly 5 letters, if it is in the word_list and if not true ask the user for another word
    while True:
        guess = input("Enter your guess: ").strip().lower()
         
        if len(guess) != 5:
            print("Invalid guess! Word must be exactly 5 letters.")
            continue

        if guess not in word_list:
            print("Word not found! Please enter a valid word.")
            continue
        
        return guess

def check_guess(guess, secret_word):
    feedback = ['absent'] * 5
    secret_letters = list(secret_word)
    for i in range(5):
        if guess[i] == secret_word[i]:
            feedback[i] = 'correct'
            secret_letters[i] = None 
    for i in range(5):
        if feedback[i] == 'absent' and guess[i] in secret_letters:
            feedback[i] = 'present'
            secret_letters[secret_letters.index(guess[i])] = None
    
    return feedback
    
def display_result(guess, feedback):
     # This function will display the guess with colored backgrounds based on the feedback
    for i in range(5):
        letter = guess[i].upper()
        
        if feedback[i] == 'correct':
            print(Back.GREEN + f" {letter} " + Style.RESET_ALL, end='')
        elif feedback[i] == 'present':
            print(Back.YELLOW + f" {letter} " + Style.RESET_ALL, end='')
        else:  
            print(Back.LIGHTBLACK_EX + f" {letter} " + Style.RESET_ALL, end='')
    
    print()

def display_end_game(won, secret_word, attempts):
     # This function will display the winning or losing message at the end of the game
    if won:
        print(f"🎉 Congratulations You DID  IT! You guessed the word '{secret_word}' in {attempts} attempts!")
    else:
        print(f"😞 Sooo Sorry, you've run out of attempts. The word was '{secret_word}'.")



def main():
    word_list = load_words("wordle.txt")

    secret_word = choose_secretword(word_list)
    
    #Constants
    max_attempts = 6
    attempts = 0
    won = False
    
    print("Welcome to Wordle!")
    print("You have 6 attempts to guess the 5-letter word.\n")
    while attempts < max_attempts and not won:
        print(f"Attempt {attempts + 1}/{max_attempts}")
        
        guess = get_validguess(word_list)
        
        feedback = check_guess(guess, secret_word)
        
        display_result(guess, feedback)
        
        if guess == secret_word:
            won = True
        
        attempts += 1
        print() 
    
    display_end_game(won, secret_word, attempts)

if __name__ == "__main__":
    main()

