"""
Wordle Game
GAME RULES:
1. A secret 5-letter word is chosen randomly from a dictionary
2. Player has 6 attempts to guess the word
3. After each guess, feedback is provided:
   - GREEN background: letter is correct and in the right position
   - YELLOW background: letter is in the word but wrong position
   - GRAY background: letter is not in the word at all
4. Win condition: guess the word correctly within 6 attempts
5. Lose condition: run out of attempts without guessing correctly
6. Invalid guesses (not 5 letters or not in dictionary) don't count as attempts

INPUT VALIDATION:
- Must be exactly 5 characters
- Must be in the dictionary (wordle.txt)
- Case insensitive (assume lowercase input)
"""
BUILT WITH THE ASSISTANCE OF CLAUDE AI
