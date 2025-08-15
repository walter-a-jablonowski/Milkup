
Can be used to finish prompts that in principle have all important information but also gaps => less work writing detailed prompts (maybe).

```
Please read the prompt in ai.md and make a new improved prompt from it in ai_improved.md without loosing any requirements from the original prompt. Make sure that the new system works as intended by the original prompt and has all of its features.

If you find problems in the original prompt (e.g. feature gaps, logical problems or something else), please fix the problems in the new prompt so that the overall system most likely will work as intended.

Don't add features that aren't in the original prompt (especially unnecessary features), except if you need to change something to fix problems.
```


Improved prompt that improves the prompts (Claude 2508)
----------------------------------------------------------

```
I use the prompt below to improve prompts that I write for coding apps. Can you make this prompt better so that the app prompts will most likely be better?[ Keep the new prompt as short as possible.]

The prompt:
```

### Short

```
Read ai.md and create an improved version in ai_improved.md. Requirements:
- Preserve all original functionality and requirements
- Fix any logical issues, ambiguities, or feature gaps that would prevent proper execution
- Maintain the original scope - only add features if essential to fix identified problems
- Ensure the system works as originally intended
```

### Long

```markdown
# Prompt Enhancement Instructions

## Primary Task
Analyze the prompt in `ai.md` and create an enhanced version in `ai_improved.md` that maintains all original functionality while improving clarity, completeness, and effectiveness.

## Core Requirements

### 1. Preserve All Original Features
- **Mandatory**: Every requirement, feature, and specification from the original prompt must be retained
- **Mandatory**: The enhanced prompt must produce the same intended behavior as the original
- **Mandatory**: No original functionality should be removed or weakened

### 2. Problem Identification and Resolution
Systematically identify and fix these common prompt issues:
- **Ambiguous instructions** that could lead to multiple interpretations
- **Missing edge cases** or error handling specifications
- **Logical inconsistencies** or contradictory requirements
- **Incomplete feature descriptions** that lack necessary implementation details
- **Vague success criteria** that make it hard to verify correct behavior
- **Missing context** about expected inputs, outputs, or use cases

### 3. Enhancement Guidelines
- **Clarity**: Rewrite unclear sections using precise, unambiguous language
- **Structure**: Organize information logically with clear sections and hierarchy
- **Completeness**: Add missing details needed for proper implementation
- **Consistency**: Ensure all parts of the prompt work together coherently
- **Specificity**: Replace vague terms with concrete, measurable requirements

### 4. Strict Constraints
- **DON'T** add new features unless they're essential to fix identified problems
- **DON'T** change the core purpose or scope of the original prompt
- **DON'T** remove any existing requirements, even if they seem redundant
- **DON'T** alter the intended user experience or system behavior

## Process Steps
1. **Read and understand** the complete original prompt
2. **Identify all requirements** and create a checklist to ensure none are missed
3. **Analyze for problems** using the categories listed above
4. **Draft improvements** that address identified issues while preserving all original features
5. **Verify completeness** by checking that every original requirement is still present and clear
6. **Test logic** by mentally walking through the enhanced prompt to ensure it produces the intended behavior

## Output Requirements
- Save the enhanced prompt as `ai_improved.md`
- Maintain the same overall structure and tone as the original where appropriate
- Use clear, professional language suitable for the target coding application
- Include all original requirements in improved form
- Ensure the enhanced version is implementable and unambiguous
```
