# Check Param
if [ $# -eq 0 ]; then
  echo "No Params"
  exit 1
fi

adb -s "$1" shell dumpsys deviceidle | grep mScreenOn
