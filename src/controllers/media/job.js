export const ElementalJob = {
  "Queue": "JOB_QUEUE_ARN",
  "UserMetadata": {},
  "Role": "IAM_ROLE_ARN",
  "Settings": {
    "OutputGroups": [
      {
        "Name": "File Group",
        "OutputGroupSettings": {
          "Type": "HLS_GROUP_SETTINGS",
          "HlsGroupSettings": {
            "ManifestDurationFormat": "INTEGER",
            "SegmentLength": 10,
            "TimedMetadataId3Period": 10,
            "CaptionLanguageSetting": "OMIT",
            "TimedMetadataId3Frame": "PRIV",
            "CodecSpecification": "RFC_4281",
            "OutputSelection": "MANIFESTS_AND_SEGMENTS",
            "ProgramDateTimePeriod": 600,
            "MinSegmentLength": 0,
            "DirectoryStructure": "SINGLE_DIRECTORY",
            "ProgramDateTime": "EXCLUDE",
            "SegmentControl": "SEGMENTED_FILES",
            "ManifestCompression": "NONE",
            "ClientCache": "ENABLED",
            "StreamInfResolution": "INCLUDE",
            "Destination": "s3://vod-output-staging/hls/",
            "DestinationSettings": {
              "S3Settings": {
                "AccessControl": {
                  "CannedAcl": "PUBLIC_READ"
                }
              }
            },
          }
        },
        "Outputs": [
          {
            "VideoDescription": {
              "ScalingBehavior": "DEFAULT",
              "TimecodeInsertion": "DISABLED",
              "AntiAlias": "ENABLED",
              "Sharpness": 50,
              "CodecSettings": {
                "Codec": "H_264",
                "H264Settings": {
                  "InterlaceMode": "PROGRESSIVE",
                  "NumberReferenceFrames": 3,
                  "Syntax": "DEFAULT",
                  "Softness": 0,
                  "GopClosedCadence": 1,
                  "GopSize": 90,
                  "Slices": 1,
                  "GopBReference": "DISABLED",
                  "SlowPal": "DISABLED",
                  "SpatialAdaptiveQuantization": "ENABLED",
                  "TemporalAdaptiveQuantization": "ENABLED",
                  "FlickerAdaptiveQuantization": "DISABLED",
                  "EntropyEncoding": "CABAC",
                  "Bitrate": 5000000,
                  "FramerateControl": "INITIALIZE_FROM_SOURCE",
                  "RateControlMode": "CBR",
                  "CodecProfile": "MAIN",
                  "Telecine": "NONE",
                  "MinIInterval": 0,
                  "AdaptiveQuantization": "HIGH",
                  "CodecLevel": "AUTO",
                  "FieldEncoding": "PAFF",
                  "SceneChangeDetect": "ENABLED",
                  "QualityTuningLevel": "SINGLE_PASS",
                  "FramerateConversionAlgorithm": "DUPLICATE_DROP",
                  "UnregisteredSeiTimecode": "DISABLED",
                  "GopSizeUnits": "FRAMES",
                  "ParControl": "INITIALIZE_FROM_SOURCE",
                  "NumberBFramesBetweenReferenceFrames": 2,
                  "RepeatPps": "DISABLED"
                }
              },
              "AfdSignaling": "NONE",
              "DropFrameTimecode": "ENABLED",
              "RespondToAfd": "NONE",
              "ColorMetadata": "INSERT"
            },
            "AudioDescriptions": [
              {
                "AudioTypeControl": "FOLLOW_INPUT",
                "CodecSettings": {
                  "Codec": "AAC",
                  "AacSettings": {
                    "AudioDescriptionBroadcasterMix": "NORMAL",
                    "Bitrate": 96000,
                    "RateControlMode": "CBR",
                    "CodecProfile": "LC",
                    "CodingMode": "CODING_MODE_2_0",
                    "RawFormat": "NONE",
                    "SampleRate": 48000,
                    "Specification": "MPEG4"
                  }
                },
                "LanguageCodeControl": "FOLLOW_INPUT"
              }
            ],
            "OutputSettings": {
              "HlsSettings": {
                "AudioGroupId": "program_audio",
                "AudioRenditionSets": "program_audio",
                "IFrameOnlyManifest": "EXCLUDE"
              }
            },
            "ContainerSettings": {
              "Container": "M3U8",
              "M3u8Settings": {
                "AudioFramesPerPes": 4,
                "PcrControl": "PCR_EVERY_PES_PACKET",
                "PmtPid": 480,
                "PrivateMetadataPid": 503,
                "ProgramNumber": 1,
                "PatInterval": 0,
                "PmtInterval": 0,
                "Scte35Source": "NONE",
                "NielsenId3": "NONE",
                "TimedMetadata": "NONE",
                "VideoPid": 481,
                "AudioPids": [
                  482,
                  483,
                  484,
                  485,
                  486,
                  487,
                  488,
                  489,
                  490,
                  491,
                  492
                ]
              }
            },
            "NameModifier": "_v1"
          },
          {
            "AudioDescriptions": [
              {
                "AudioTypeControl": "FOLLOW_INPUT",
                "CodecSettings": {
                  "Codec": "AAC",
                  "AacSettings": {
                    "AudioDescriptionBroadcasterMix": "NORMAL",
                    "RateControlMode": "CBR",
                    "CodecProfile": "LC",
                    "CodingMode": "CODING_MODE_2_0",
                    "RawFormat": "NONE",
                    "SampleRate": 48000,
                    "Specification": "MPEG4",
                    "Bitrate": 64000
                  }
                },
                "LanguageCodeControl": "FOLLOW_INPUT",
                "AudioSourceName": "Audio Selector 1",
                "StreamName": "English",
                "LanguageCode": "ENG"
              }
            ],
            "OutputSettings": {
              "HlsSettings": {
                "AudioGroupId": "program_audio",
                "AudioRenditionSets": "program_audio",
                "IFrameOnlyManifest": "EXCLUDE",
                "AudioTrackType": "ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT"
              }
            },
            "ContainerSettings": {
              "Container": "M3U8",
              "M3u8Settings": {
                "AudioFramesPerPes": 4,
                "PcrControl": "PCR_EVERY_PES_PACKET",
                "PmtPid": 480,
                "PrivateMetadataPid": 503,
                "ProgramNumber": 1,
                "PatInterval": 0,
                "PmtInterval": 0,
                "Scte35Source": "NONE",
                "NielsenId3": "NONE",
                "TimedMetadata": "NONE",
                "VideoPid": 481,
                "AudioPids": [
                  482,
                  483,
                  484,
                  485,
                  486,
                  487,
                  488,
                  489,
                  490,
                  491,
                  492
                ]
              }
            },
            "NameModifier": "_a1"
          },
          {
            "AudioDescriptions": [
              {
                "AudioTypeControl": "FOLLOW_INPUT",
                "CodecSettings": {
                  "Codec": "AAC",
                  "AacSettings": {
                    "AudioDescriptionBroadcasterMix": "NORMAL",
                    "RateControlMode": "CBR",
                    "CodecProfile": "LC",
                    "CodingMode": "CODING_MODE_2_0",
                    "RawFormat": "NONE",
                    "SampleRate": 48000,
                    "Specification": "MPEG4",
                    "Bitrate": 64000
                  }
                },
                "LanguageCodeControl": "FOLLOW_INPUT",
                "AudioSourceName": "Audio Selector 2",
                "StreamName": "Spanish",
                "LanguageCode": "SPA"
              }
            ],
            "OutputSettings": {
              "HlsSettings": {
                "AudioGroupId": "program_audio",
                "AudioRenditionSets": "program_audio",
                "IFrameOnlyManifest": "EXCLUDE",
                "AudioTrackType": "ALTERNATE_AUDIO_AUTO_SELECT"
              }
            },
            "ContainerSettings": {
              "Container": "M3U8",
              "M3u8Settings": {
                "AudioFramesPerPes": 4,
                "PcrControl": "PCR_EVERY_PES_PACKET",
                "PmtPid": 480,
                "PrivateMetadataPid": 503,
                "ProgramNumber": 1,
                "PatInterval": 0,
                "PmtInterval": 0,
                "Scte35Source": "NONE",
                "NielsenId3": "NONE",
                "TimedMetadata": "NONE",
                "VideoPid": 481,
                "AudioPids": [
                  482,
                  483,
                  484,
                  485,
                  486,
                  487,
                  488,
                  489,
                  490,
                  491,
                  492
                ]
              }
            },
            "NameModifier": "_a2"
          }
        ]
      }
    ],
    "AdAvailOffset": 0,
    "Inputs": [
      {
        "AudioSelectors": {
          "Audio Selector 1": {
            "Offset": 0,
            "DefaultSelection": "DEFAULT",
            "ProgramSelection": 1,
            "SelectorType": "TRACK",
            "Tracks": [
              1
            ]
          }
        },
        "VideoSelector": {
          "ColorSpace": "FOLLOW"
        },
        "FilterEnable": "AUTO",
        "PsiControl": "USE_PSI",
        "FilterStrength": 0,
        "DeblockFilter": "DISABLED",
        "DenoiseFilter": "DISABLED",
        "TimecodeSource": "EMBEDDED",
        "FileInput": "s3://INPUT_BUCKET_AND_FILE_NAME"
      }
    ],
    "TimecodeConfig": {
      "Source": "ZEROBASED"
    }
  }
};
