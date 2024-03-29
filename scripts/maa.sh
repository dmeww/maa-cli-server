# Check Param
if [ $# -eq 0 ]; then
  echo "No Params"
  exit 1
fi

# Exec Cmds
maa 2>&1 run "$1" -v
