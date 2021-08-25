const YAML = require('yaml')
const _ = require('lodash')

//story steps from stories.yml not used in matching
const ignoredSteps = ['checkpoint']

// matches event log with stories, adds corresponding story tags to the log
const matchLogWithStories = (stories, rules, logArray) => {
  let i = 0

  while (i < logArray.length) {
    let matchingStories = _.cloneDeep(stories)
    let matchingRules = _.cloneDeep(rules)
    let stepCounter = 0

    console.log(stories)

    while (i < logArray.length) {
      let logStep = logArray[i].story_step
      if (logStep !== undefined) {
        matchingStories = matchStep(logStep, matchingStories)
        matchingRules = matchStep(logStep, matchingRules)

        // console.log(matchingStories)

        if (matchingStories.length === 0 && matchingRules.length === 0) {
          if (stepCounter === 0) {
            i++
          }
          break
        }
        if (matchingStories.length !== 0) {
          logArray[i].story = matchingStories.map(story => story.story).join(' || ')
        }
        if (matchingRules.length !== 0) {
          logArray[i].rule = matchingRules.map(rule => rule.rule).join(' || ')
        }
      }
      stepCounter++
      i++
    }
  }
  return logArray
}

// filter stories not containing a given story step
const matchStep = (logStep, stories) => {
  matchedStories = stories.filter(story => YAML.stringify(story.steps).includes(logStep))

  matchedStories = removeMatchedSteps(matchedStories, logStep)

  return matchedStories
}

const removeMatchedSteps = (stories, logStep) => {
  stories.forEach(story => {
    for (let i = 0; i < story.steps.length; i++) {
      if (YAML.stringify(story.steps[i]).includes(logStep)) {
        story.steps[i] = 'MATCHED'
        break
      }
    }
  })
  return stories
}

module.exports = { matchLogWithStories }