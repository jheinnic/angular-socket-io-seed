
/**
 * Module dependencies
 */

/**
 * Configuration
 */
var mockCobrandData =
  new Array({
    href: 'http://loadtest.irally.jchein.info:3000/api/v1/cobrands/a1b2', 
    curie: 'cobrand:a1b2',
    portalUriRoot: 'uno.jchein.info',
    displayName: "Unoversity",
    privateUserExtent: {
      href: 'http://loadtest.irally.jchein.info:3000/api/v1/userExtents/e03d', 
      curie: 'userExtent:e03d',
      enrollmentMethods: {
        adminGui: true,
        batchImport: true,
        selfRegistration: false
      },
      emailPolicy: {
        asUsername: false,
        selfService: false
      },
      authentModes: {
        teacherConsoleMatch: true,
        teacherHotpToken: true,
        studentPassword: false,
        studentTotpToken: true,
        // useTwoFactor: false
      },
      passwordPolicy: {
        teacherMayApprove: true, // For in-class use.  Teacher confirms identity of student at console by examining
                                 // an identifcation code on its display and matching it to the request, then approves
                                 // carrying out rest of password reset workflow.  Password is set/randomized/defaulted
                                 // as appropriate for student password control options.  If TOTP is allowed,
                                 // student may alternately chose to generate a new Key/QR Code pair.
        teacherMayGrant: false,  // For cases where in-class use is prohibitive (e.g. large classroom and no
                                 // handheld devices for teachers).  Teacher generate a HOTP token, ties it to
                                 // the help request, and sends it by whatever out-of-game channel is available
                                 // to reach those who made the request (e.g. asking them to come to his/her desk).
                                 // Student enters the HOTP and then continues through last workflow steps.
        teacherMaySet: false,    // For in-class, but out-of-game requests made by students.  Teacher may lookup an
                                 // account by its username and explicitly override the password.  Teacher gives
                                 // the new password to student, who is then asked to set or randomize it on their
                                 // next login.  IF both "studentMayXXX" flags are false, a single randomize will occur.
        studentMayRandomize: true,
        studentMaySet: false, 
        changeAtFirstLogin: true,
        randomStrengthModes: {
          useDictionary: true,   // Weak passwords, two word from a dictionary with a number in between
          lowerCase: true,
          mixedCase: true,
          lowerCaseDigits: true,
          mixedCaseDigits: true,
          allSymbols: false,
          minLength: 6,
          maxLength: 12
        },
        blankPassword: {
          allowed: true,
          enablesFreeAuth: false  // If false, means no password can be used to login
        },
        teacherBulkUpdate: {
          singleFixed: true,   // Select N accounts and set the same password on each.  The specific password can be
                               // HOTP token derived, an approved randomization, a typed string, an expression with
                               // variables bound to account field values, or an empty blank
          uniqueRandom: true,
          hotpCycle: true,
        }
      }
    },
    publicIRallyExtent: {
      authorizationModes: {
        openTrust: false,
        inClassVerify: true,
        hotpTokens: false
      }
    },
    teamCreationModes: {
      offlineModes: {
        otpToken: {
          available: true,
          asHyperlink: false,
          asNumericCode: true,
          expirationLimit: 48,
        },
        teacherConfigured: {
          available: true
        }
      },
      onlineEvents: {
        minTeamSize: 3,
        idealTeamSize: 4,
        maxTeamSize: 6,
        liveOptInMode: {
          available: true,
          inviteAuthority: {
            captainMayDelegate: false,
            chainOfAuthority: true,
            freeForAll: true,
            teamCaptainOnly: false
          },
          messageChannels: {
            toAllOnline: false,
            toFreeAgents: true,
            toTeamMembers: true,
            toOneOnline: false,
            toOneFreeAgent: false,
            toOneTeamMember: true
          }
        },
        liveDraftMode: {
          available: true,
          captainsChosen: {
            atRandom: true,
            byTeacher: true,
            popularVote: true
          }
        },
        liveLotteryMode: {
          available: true,
          tradingPlacesPhase: true
        },
        teamNameChosen: {
          randomAndAutomatic: false,
          setByCaptain: false,
          captainDelegates: true,
          captainPicksOneFromTeam: true,
          openFieldPopularVote: true,
          openFieldDrawLots: false,
          teamPicksOneFromCaptain: true
        }
      }
    }  
  },
  {
    href: 'http://loadtest.irally.jchein.info:3000/api/v1/cobrands/k3hd', 
    curie: 'cobrand:k3hd',
    portalUriRoot: 'yahtzee.jchein.info',
    displayName: 'School Two',
    privateUserExtent: {
      href: 'http://loadtest.irally.jchein.info:3000/api/v1/userExtents/2d9a', 
      curie: 'userExtent:2d9a',
      enrollmentMethods: {
        adminGui: true,
        batchImport: true,
        selfRegistration: false
      },
      emailPolicy: {
        asUsername: false,
        selfService: false
      },
      authentModes: {
        teacherConsoleMatch: true,
        teacherHotpToken: true,
        studentPassword: false,
        studentTotpToken: true,
        // useTwoFactor: false
      },
      passwordPolicy: {
        teacherMayApprove: true, // For in-class use.  Teacher confirms identity of student at console by examining
                                 // an identifcation code on its display and matching it to the request, then approves
                                 // carrying out rest of password reset workflow.  Password is set/randomized/defaulted
                                 // as appropriate for student password control options.  If TOTP is allowed,
                                 // student may alternately chose to generate a new Key/QR Code pair.
        teacherMayGrant: false,  // For cases where in-class use is prohibitive (e.g. large classroom and no
                                 // handheld devices for teachers).  Teacher generate a HOTP token, ties it to
                                 // the help request, and sends it by whatever out-of-game channel is available
                                 // to reach those who made the request (e.g. asking them to come to his/her desk).
                                 // Student enters the HOTP and then continues through last workflow steps.
        teacherMaySet: false,    // For in-class, but out-of-game requests made by students.  Teacher may lookup an
                                 // account by its username and explicitly override the password.  Teacher gives
                                 // the new password to student, who is then asked to set or randomize it on their
                                 // next login.  IF both "studentMayXXX" flags are false, a single randomize will occur.
        studentMayRandomize: true,
        studentMaySet: false, 
        changeAtFirstLogin: true,
        randomStrengthModes: {
          useDictionary: true,   // Weak passwords, two word from a dictionary with a number in between
          lowerCase: true,
          mixedCase: true,
          lowerCaseDigits: true,
          mixedCaseDigits: true,
          allSymbols: false,
          minLength: 6,
          maxLength: 12
        },
        blankPassword: {
          allowed: true,
          enablesFreeAuth: false  // If false, means no password can be used to login
        },
        teacherBulkUpdate: {
          singleFixed: true,   // Select N accounts and set the same password on each.  The specific password can be
                               // HOTP token derived, an approved randomization, a typed string, an expression with
                               // variables bound to account field values, or an empty blank
          uniqueRandom: true,
          hotpCycle: true,
        }
      }
    },
    publicIRallyExtent: null,
    teamCreationModes: {
      offlineModes: null,
      onlineEvents: {
        minTeamSize: 3,
        idealTeamSize: 4,
        maxTeamSize: 6,
        liveOptInMode: {
          available: true,
          inviteAuthority: {
            captainMayDelegate: false,
            chainOfAuthority: true,
            freeForAll: true,
            teamCaptainOnly: false
          },
          messageChannels: {
            toAllOnline: false,
            toFreeAgents: true,
            toTeamMembers: true,
            toOneOnline: false,
            toOneFreeAgent: false,
            toOneTeamMember: true
          }
        },
        liveDraftMode: {
          available: true,
          captainsChosen: {
            atRandom: true,
            byTeacher: true,
            popularVote: true
          }
        },
        liveLotteryMode: {
          available: true,
          tradingPlacesPhase: true
        },
        teamNameChosen: {
          randomAndAutomatic: false,
          setByCaptain: false,
          captainDelegates: true,
          captainPicksOneFromTeam: true,
          openFieldPopularVote: true,
          openFieldDrawLots: false,
          teamPicksOneFromCaptain: true
        }
      }
    }  
  });

CobrandProvider = function CobrandProvider() {
  this.findAll = function(callback) {
    callback(mockCobrandData);
  }

  return this;
};
module.exports = CobrandProvider;
