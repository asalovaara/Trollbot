const YAML = require('yaml')

//story steps from stories.yml not used in matching
const ignoredSteps = ['slot_was_set', 'checkpoint']

// matches event log with stories, adds corresponding story tags to the log
const matchLogWithStories = (stories, rules, logArray) => {

  const filteredStories = filterStories(stories)
  const filteredRules = filterStories(rules)

  let i = 0

  while (i < logArray.length) {
    let matchingStories = filteredStories
    let matchingRules = filteredRules

    while (i < logArray.length) {

      let logStep = logArray[i].story_step
      if (logStep !== undefined) {
        matchingStories = matchStep(logStep, matchingStories)
        matchingRules = matchStep(logStep, matchingRules)

        if (matchingStories.length === 0 && matchingRules.length === 0) {
          break
        }
        if (matchingStories.length !== 0) {
          logArray[i].story = matchingStories.map(story => story.story).join(' || ')
        }
        if (matchingRules.length !== 0) {
          logArray[i].rule = matchingRules.map(rule => rule.rule).join(' || ')
        }
      }
      i++
    }
  }
  return logArray
}

// filter stories not containing a given story step
const matchStep = (logStep, stories) => {
  matchedStories = stories.filter(story => YAML.stringify(story.steps).includes(logStep))

  return matchedStories
}

// filters story steps not used in matching
const filterStories = (stories) => {
  let filteredObjects = []
  let i = 0

  stories.forEach(story => {
    const filteredSteps = story.steps.filter(step => !(ignoredSteps.includes(Object.keys(step))))
    if (story.story !== undefined) {
      filteredObjects[i] = { story: story.story, steps: filteredSteps }
    } else {
      filteredObjects[i] = { rule: story.rule, steps: filteredSteps }
    }
    i++
  })
  return filteredObjects
}

module.exports = { matchLogWithStories }