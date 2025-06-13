# Sample Data for NekoLingo API

This directory contains comprehensive sample JSON data for the NekoLingo language learning application. The data is designed to demonstrate the relationships between different entities and provide examples for frontend development.

## File Structure

- `languages.json` - Base languages supported by the application
- `courses.json` - Language courses (2 courses with different language pairs)
- `topics.json` - Topics within courses (5 topics per course)
- `lessons.json` - Lessons within topics (multiple lessons per topic)
- `vocabulary.json` - Vocabulary entries for different languages
- `grammar.json` - Grammar rules and structures
- `vocab-topics.json` - Relationships between topics and vocabulary/grammar
- `exercises.json` - Practice exercises linked to lessons

## Data Relationships

```
Languages
    ↓
Courses (language_from → language_to)
    ↓
Topics (ordered within course)
    ↓
Lessons (ordered within topic)
    ↓
Exercises (multiple per lesson)

Vocabulary/Grammar ←→ VocabTopics ←→ Topics
```

## Course Structure

### Course 1: Vietnamese for English Speakers

- **Target Audience**: English speakers learning Vietnamese
- **Topics**:
  1. Greetings and Introductions
  2. Family and Relationships
  3. Food and Dining
  4. Transportation and Directions
  5. Shopping and Money

### Course 2: English for Vietnamese Speakers

- **Target Audience**: Vietnamese speakers learning English
- **Topics**:
  1. Basic Conversations
  2. Work and School
  3. Health and Body
  4. Weather and Time
  5. Hobbies and Entertainment

## Exercise Types

The sample data includes all supported exercise types:

### 1. Vocabulary Exercises

- **multiple_choice**: Select the correct translation
- **match**: Match words with their meanings
- **image_select**: Choose image based on word/audio

### 2. Grammar Exercises

- **fill_in_blank**: Complete sentences with correct grammar
- **reorder**: Arrange words to form correct sentences

### 3. Listening Exercises

- **true_false**: Listen and determine if statement is correct
- **multiple_choice**: Listen and choose correct answer
- **image_select**: Listen and select corresponding image

### 4. Reading Exercises

- **true_false**: Read passage and answer true/false questions
- **multiple_choice**: Read and answer comprehension questions

### 5. Speaking Exercises

- **multiple_choice**: Record pronunciation (evaluated by teacher or automatically)

## Question Formats

- `fill_in_blank` - Fill in missing words
- `match` - Match items in two lists
- `reorder` - Arrange items in correct order
- `image_select` - Select correct image from options
- `multiple_choice` - Choose from multiple options
- `true_false` - Answer true or false

## Sample Data Features

### Realistic Content

- Authentic Vietnamese and English phrases
- Cultural context and usage notes
- Proper pronunciation guides
- Real-world scenarios

### Comprehensive Coverage

- All exercise types and question formats
- Different difficulty levels (easy, medium, hard)
- Various content types (greetings, family, food, etc.)
- Both language directions (EN→VI and VI→EN)

### Rich Metadata

- Audio URLs for pronunciation
- Image URLs for visual learning
- Extra data with hints, explanations, and cultural notes
- Progress tracking compatibility

## Usage for Frontend Development

### API Integration

These samples show the exact format returned by the API endpoints:

- `GET /languages` → `languages.json`
- `GET /courses` → `courses.json`
- `GET /topics` → `topics.json`
- `GET /lessons` → `lessons.json`
- `GET /exercises` → `exercises.json`

### UI Component Examples

Use this data to build and test:

- Course selection interfaces
- Lesson navigation
- Exercise interaction components
- Progress tracking displays
- Audio/image integration

### Data Validation

All sample data follows the exact schema defined in the API models:

- Proper ObjectId format for references
- Required fields populated
- Enum values match API specifications
- Timestamps in ISO format

## Key Features Demonstrated

1. **Multi-language Support**: English ↔ Vietnamese
2. **Structured Learning Path**: Course → Topic → Lesson → Exercise
3. **Diverse Exercise Types**: All 6 question formats across 5 exercise types
4. **Rich Media**: Audio files, images, and interactive content
5. **Educational Metadata**: Difficulty levels, hints, explanations
6. **Progress Tracking**: Structured for user progress monitoring

## Notes for Developers

- All IDs use MongoDB ObjectId format
- Audio/image URLs are placeholder examples
- Exercise `correct_answer` format varies by question type:
  - String for simple answers
  - Array for ordered answers (reorder)
  - Object for key-value pairs (match)
  - Boolean for true/false
  - null for speaking exercises (manual evaluation)

This sample data provides a complete foundation for developing and testing the NekoLingo frontend application.
