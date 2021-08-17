const YAML = require('yaml')

// matches event log with stories, adds corresponding story tags to the log
const matchLogWithStories = (stories, rules, logArray) => {
  let storyStart = 0

  for (let i = 0; i < logArray.length; i++) {
    let matchingStories = stories
    let matchingRules = rules

    if (logArray[i].story_step === '. . .') {

      for (let j = storyStart; j < i; j++) {
        let logStep = logArray[j].story_step

        if (logStep !== undefined) {
          matchingStories = matchStep(logStep, matchingStories)
          matchingRules = matchStep(logStep, matchingRules)
        }
        logArray = addStoryTags(storyStart, j, matchingStories, logArray)
        logArray = addRuleTags(storyStart, j, matchingRules, logArray)
      }
      storyStart = i + 1
    }
  }

  return logArray
}

// filter stories not containing a given story step
const matchStep = (logStep, stories) => {
  const matchedStories = stories.filter(story => YAML.stringify(story).includes(logStep))

  return matchedStories
}

// tags matched events with the name of the matching story
const addStoryTags = (i, end, stories, logArray) => {
  if (stories.length === 1) {
    const tag = stories[0].story
    for (i; i <= end; i++) {
      logArray[i].story = tag
    }
  }

  return logArray
}

const addRuleTags = (i, end, rules, logArray) => {
  if (rules.length === 1) {
    const tag = rules[0].rule
    for (i; i <= end; i++) {
      logArray[i].rule = tag
    }
  }

  return logArray
}

module.exports = {matchLogWithStories}