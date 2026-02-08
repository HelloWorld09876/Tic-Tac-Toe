# MTC Tic-Tac-Toe (Microsoft Tech Club Recruitment Task)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Status-Complete-success?style=for-the-badge)

<div align="center">
  <img src="preview.png" alt="MTC Tic-Tac-Toe Gameplay Preview" width="600" />
</div>

## Project Overview

**MTC Tic-Tac-Toe** is a modern, responsive web application developed for the Microsoft Tech Club (MTC) stall events. It demonstrates clean coding practices and adheres to **Microsoft's Fluent Design** principles.

The application features a polished UI using the official Microsoft color palette (#F25022, #7FBA00, #00A4EF, #FFB900) and provides a robust gaming experience suitable for recruitment showcases.

## Key Features

-   **Unbeatable AI (Minimax Algorithm)**: A "Hard Mode" where the computer never loses, implemented using the Minimax recursive algorithm.
-   **Event-Ready Scoreboard**:
    -   **Restart Game**: Clears the board for a new round while preserving the win streak.
    -   **Reset Score**: Instantly zeros out all counters (Player, Computer, Draws) for the next stall visitor.
-   **Fluent Design Aesthetics**: Soft shadows, rounded corners, glassmorphism effects, and smooth animations.
-   **Responsive Layout**: Fully functional on desktops, tablets, and mobile devices.

## Technical Deep Dive: Minimax Algorithm

The core of the "Unbeatable" difficulty is the **Minimax Algorithm**.

Minimax is a recursive backtracking algorithm used in decision theory and game theory. In this application:
1.  **Recursion**: The algorithm simulates every possible move for the current board state.
2.  **Scoring**: It assigns a score to each terminal state (+10 for AI win, -10 for Player win, 0 for Draw).
3.  **Optimization**: The AI (Maximizer) chooses the move with the highest score, while assuming the Opponent (Minimizer) will always play perfectly to get the lowest score.

This ensures that the AI looks ahead to the end of the game and always selects the optimal path, making it mathematically impossible for the user to win.

## Setup Instructions

This project is a static web application requiring no build steps or package managers.

1.  **Clone or Download** the repository.
2.  Navigate to the project folder.
3.  Double-click `index.html` to open it in your default web browser.

## License

This project is licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2026 Microsoft Tech Club Applicant

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
